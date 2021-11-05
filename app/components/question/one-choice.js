import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class OneChoice extends Component {

	@tracked selectedAnswer;
	startQuestion = new Date();

	@action
	setup() {
		const foundResponse = this.args.savedAnswers.find((questRecord) => questRecord.question.id === this.args.question.id);
		this.selectedAnswer = foundResponse ? foundResponse.answer : null;
	}

	@action
	handleAnswer(answer) {
		if (this.selectedAnswer) {
			this.args.onRemoveAnswer(`${this.args.question.id}-${this.selectedAnswer.id}`);
		}

		this.selectedAnswer = this.selectedAnswer && this.selectedAnswer.id === answer.id ? null : answer;
		if (this.selectedAnswer) {
			this.args.onAddAnswer(
				{
					id: `${this.args.question.id}-${answer.id}`,
					answer: answer,
					question: this.args.question,
					startQuestion: this.startQuestion
				}
			);
		} else {
			const e = document.getElementById(answer.id);
            e.blur();
		}
	}
}