import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class PyramidChoice extends Component {
    @tracked answers;
    startQuestion = new Date();

    @action
    setup() {
        const questionSavedAnswers = this.args.savedAnswers.filter((questRecord) => questRecord.question.id === this.args.question.id);
        this.answers = questionSavedAnswers.length ?  this.recordToAnswer(questionSavedAnswers) : A(this.args.question.answers.slice());
    }

    recordToAnswer(questionSavedAnswers) {
        const orderedAnswers = A([]);
        questionSavedAnswers.sortBy('orderNumber').forEach(questRecord => {
            const foundAnswer = this.args.question.answers.find(answer => questRecord.answer.id === answer.id);
            orderedAnswers.push(foundAnswer); 

        });
        return orderedAnswers;
    }
 
    @action
    dragEnd() {
        this.saveNewOrder();
    }

    @action
    answerUp(index) {
        const currentAnswer = this.answers.objectAt(index);
        const upAnswer = this.answers.objectAt(index - 1);
        this.answers.replace(index - 1, 1, [currentAnswer]);
        this.answers.replace(index, 1, [upAnswer]);
        this.saveNewOrder();
    }

    @action
    answerDown(index) {
        const currentAnswer = this.answers.objectAt(index);
        const belowAnswer = this.answers.objectAt(index + 1);
        this.answers.replace(index + 1, 1, [currentAnswer]);
        this.answers.replace(index, 1, [belowAnswer]);
        this.saveNewOrder();
    }
 
    @action
    clear() {
        this.answers = A(this.args.question.answers.slice());
        this.saveNewOrder();
    }

    saveNewOrder() {
        this.args.onRemoveAnswers(this.args.question.id);
        this.answers.forEach((answer, index) => {
            this.args.onAddAnswer(
				{
					id: `${this.args.question.id}-${answer.id}`,
					answer: answer,
					question: this.args.question,
					startQuestion: this.startQuestion,
                    orderNr: index + 1
				}
			);
        });
    }
}