import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import {tracked} from "@glimmer/tracking";
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

export default class Email extends Component {
	@service store;
	emailRegex = /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
	@tracked email = '';
	@tracked isEmailValid = true;
	startQuestion = new Date();
    enteredAnswer;

	@action
	setup() {
		const foundResponse = this.args.savedAnswers.find((questRecord) => questRecord.question.id === this.args.question.id);
		this.email = foundResponse ? foundResponse.answerText : '';
		this.emailRecord = this.setupEmailRecord(foundResponse);
	}

	setupEmailRecord(foundResponse) {
		if(foundResponse) {
			const record = this.store.peekRecord('quest-record', foundResponse.id);
			record.startQuestion = this.startQuestion;
			return record;
		} else {
			return this.store.createRecord('quest-record', {
				question: this.args.question,
				startQuestion: this.startQuestion,
				openAnswer: true,
				answerText: '',
				anonymousUser: this.args.anonymousUser
			});
		}
	}

	@action
	handleInput(e) {
		debounce(this, this.setEmailValue, e.target.value, 1500);
	}

	setEmailValue(email) {
		this.isEmailValid = isEmpty(email) || this.emailRegex.test(email);
		if(isEmpty(email)) {
			const savedEmailId = this.emailRecord ? this.emailRecord.id : undefined;
            this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`, savedEmailId);
			this.emailRecord = this.setupEmailRecord();
        } else if(this.emailRegex.test(email)) {
			this.emailRecord.id = this.emailRecord.id ? this.emailRecord.id : `${this.args.question.id}-openAnswer`;
			this.emailRecord.answerText = email;
            this.args.onUpdateAnswer(this.emailRecord);
        }
	}
}
