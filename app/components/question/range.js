import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Range extends Component {
	@service store;
	@tracked selectedRangeAnswer;
	startQuestion = new Date();

	@action
	setup() {
		const foundResponse = this.args.savedAnswers.find((questRecord) => questRecord.question.id === this.args.question.id);
		this.selectedRangeAnswer = foundResponse ? parseInt(foundResponse.answerText) : -1;
		this.rangeRecord = this.setupRangeRecord(foundResponse)
	}

	setupRangeRecord(foundResponse) {
		if(foundResponse) {
			const record = this.store.peekRecord('quest-record', foundResponse.id);
			record.startQuestion = this.startQuestion;
			return record;
		} else {
			return this.store.createRecord('quest-record', {
				question: this.args.question,
				startQuestion: this.startQuestion,
				openAnswer: false,
				answerText: '',
				anonymousUser: this.args.anonymousUser
			});
		}
	}

	get rangeValues() {
		let rangeArr = A([]);
		const rangeStart = parseInt(this.args.question.rangeStart);
		const rangeEnd = parseInt(this.args.question.rangeEnd)
		for (let i = rangeStart; i <= rangeEnd; i++) {
			rangeArr.pushObject(i);
		}
		return rangeArr
	}

	@action
	handleAnswer(range) {
		if (this.rangeRecord.id) {
			this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`, this.rangeRecord.id);
			this.rangeRecord = this.setupRangeRecord();
		}

		if (this.selectedRangeAnswer !== range) {
			this.selectedRangeAnswer = range;
			this.rangeRecord.answerText = range;
			this.args.onUpdateAnswer(this.rangeRecord);
		} else {
			this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`);
			const e = document.getElementById(this.selectedRangeAnswer);
			e.blur();
			this.selectedRangeAnswer = -1;
		}
	}
}
