import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class Text extends Component {

    @service store;
	@tracked textAnswered;
	startQuestion = new Date();
    enteredAnswer;

	@action
	setup() {
		const foundResponse = this.args.savedAnswers.find((questRecord) => questRecord.question.id === this.args.question.id);
        this.textAnswered = foundResponse ? foundResponse.answerText : '';
		this.enteredAnswer = this.setupTextRecord(foundResponse);
	}

	setupTextRecord(foundResponse) {
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
	handleAnswer() {
        if(isEmpty(this.textAnswered)) {
            this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`, this.enteredAnswer.id);
			this.enteredAnswer = this.setupTextRecord();
        } else {
			this.enteredAnswer.id = this.enteredAnswer.id ? this.enteredAnswer.id : `${this.args.question.id}-openAnswer`;
			this.enteredAnswer.answerText = this.textAnswered;
            this.args.onUpdateAnswer(this.enteredAnswer);
        }
    }

}
