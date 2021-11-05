import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class MultipleChoices extends Component {
    @service store;
    @tracked answersIds;
    otherRecord;

    constructor() {
        super(...arguments);
        this.startQuestion = new Date();
        const questionSavedAnswers = this.args.savedAnswers.filter((questRecord) => questRecord.question.id === this.args.question.id);
        const answersIds = A([]);
        let savedOtherAnswer = null;
        questionSavedAnswers.forEach((questRecord)=>{
            if (questRecord.openAnswer) {
                savedOtherAnswer = questRecord;
            } else {
                answersIds.pushObject(questRecord.answer.id);
            }
        });
        this.otherRecord = this.setupOtherRecord(savedOtherAnswer);
        this.answersIds = answersIds;
    }

    setupOtherRecord(foundResponse) {
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
    handleAnswer(answer) {
        if (this.answersIds.indexOf(answer.id) === -1) {
            this.answersIds.pushObject(answer.id);
            this.args.onAddAnswer(
                {
                    id: `${this.args.question.id}-${answer.id}`,
                    answer: answer,
                    question: this.args.question,
                    startQuestion: this.startQuestion
                }
            );
        } else {
            this.answersIds.removeObject(answer.id);
            const e = document.getElementById(answer.id);
            e.blur();
            this.args.onRemoveAnswer(`${this.args.question.id}-${answer.id}`);
        }
    }

    @action
    handleOtherAnswer(textAnswered) {
        if(isEmpty(textAnswered)) {
            this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`, this.otherRecord.id);
			this.otherRecord = this.setupOtherRecord();
        } else {
			this.otherRecord.id = this.otherRecord.id ? this.otherRecord.id : `${this.args.question.id}-openAnswer`;
			this.otherRecord.answerText = textAnswered;
            this.args.onUpdateAnswer(this.otherRecord);
        }
    }


}
