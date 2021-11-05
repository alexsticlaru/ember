import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class QuestionEditComponent extends Component {
  @service store;
  @service intl;

  get rangeValues() {
    let array = [];
    for (let i = 0; i < this.args.question.rangeEnd; i++) {
      array[i] = i +1;
    }
    return array;
  }

  @action saveQuestion() {
    this.args.question.save();
  }

  @action changeQuestionType(fieldType) {
    this.args.question.fieldType = fieldType;
    this.args.question.save();

    if (fieldType == 'yes_no') {
      //reset questions
      this.args.question.answers.forEach((answer) => {
        answer.destroyRecord();
      });

      this.store.createRecord('quest-answer', {
					question: this.args.question,
					answer: this.intl.t('questionnaire.yesAnswer'),
          gotoQuestion: null,
					orderNr: 0
				}).save();
        this.store.createRecord('quest-answer', {
					question: this.args.question,
					answer: this.intl.t('questionnaire.noAnswer'),
          gotoQuestion: null,
					orderNr: 1
				}).save();
			}
  }

  @action changeQuestionRequired() {
    this.args.question.required = !this.args.question.required;
    this.args.question.save();
  }

  @action addAnswer() {
    const orderNr = this.args.question.answers.length +1
    this.store.createRecord('quest-answer', {
      question: this.args.question,
      answer: "Answer " + orderNr,
      gotoQuestion: null,
      orderNr
    });
  }

  @action addOther() {
    this.args.question.allowOpenAnswer = true;
    this.args.question.save();
  }

  @action removeOther() {
    this.args.question.allowOpenAnswer = false;
    this.args.question.save();
  }

  @action saveAnswer(answer) {
    answer.save();
  }

  @action changeQuestionRange(range) {
    this.args.question.rangeEnd = range;
    this.args.question.save();
  }

  @action changeGoToQuestion(answer, questionNr) {
    answer.gotoQuestion = questionNr;
    answer.save();
  }

  @action deleteAnswer(answer) {
    answer.destroyRecord();
  }

}
