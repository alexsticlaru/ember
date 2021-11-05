import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import RSVP from 'rsvp';
import { next } from '@ember/runloop';

export default class QuestionTabComponent extends Component {
  @service store;
  @service toast;
  @service intl;

  saveInProgress = false;
  saveAgain = false;

  @tracked processingChanges=false;
  @tracked changesSaved= false;

  get questionnaire() {
    return this.store.peekRecord('quest-form', this.args.participationPack.questionnaire.get('id'));
  }

  get questions() {
    return this.questionnaire.questions.sortBy('orderNr');
  }

  @action addQuestion() {
    this.store.createRecord('quest-question', {
      content: "",
      form: this.questionnaire,
      orderNr: this.questionnaire.questions.length + 1,
      question: '',
      fieldType: 'text',
      required: false,
      allowOpenAnswer: false,
      rangeStart: 1,
      rangeEnd: 10
    }).save();
  }

  @action saveQuestionnaire() {
    this.questionnaire.save();
    this.saveAllQuestions(true);
  }

	@action dragEnd() {
		this.questionnaire.questions.forEach((question, index) => {
			question.orderNr = index + 1;
		});
		this.saveAllQuestions();
	}

	/**
	 * Saves all questions
	 * - makes sure this is not executed multiple times at the same time - can be caused by rapidly re-ordering questions
	 * - will run itself again if that happens
	 * @param showSuccessMessage shows a toaster with "Questionnaire saved" on the last execution
	 */
	saveAllQuestions(showSuccessMessage = false) {
    if (showSuccessMessage) {
      this.processingChanges = true;
    }

		if (this.saveInProgress) {
			this.saveAgain = true;
			return;
		}
		this.saveInProgress = true;

		this.questions.forEach((quest, index) => {
			quest.orderNr = index + 1;
		});

		// gather all the Save promises
		const promises = [];
		this.questions.forEach((question) => {
			const promise = question.save().catch(() => {
				// retry the save
				return question.save().catch(() => {
					return question.save();
				});
			});
			promises.pushObject(promise);
		});

		// wait for all the Saves to be completed
		RSVP.all(promises).then(
			() => {
				// schedule to execute this function again if needed
				this.saveInProgress = false
				if (this.saveAgain) {
					this.saveAgain = false;
					next(this, function () {
						this.saveAllQuestions();
					});
				} else {
					if (showSuccessMessage) {
						this.processingChanges = false;
						this.toast.success(this.intl.t('bubble.questionnaire.save.message'));
						this.changesSaved = true;
						setTimeout(() => {
							this.changesSaved = false;
						}, 3000);
					}
				}
			}
		);
	}

  @action
  deleteQuestion(question) {
    question.deleteRecord();
    question.save();
    this.questionnaire.questions.removeObject(question);
    this.questions.forEach((quest, index) => {
      quest.orderNr = index + 1;
      quest.save();
    });
  }

	@action
	moveQuestionUp(question) {
		const position = question.orderNr;
		this.questions.forEach((q) => {
			if (q.orderNr == position - 1) {
				q.orderNr++;
			} else if (q.orderNr == position) {
				q.orderNr--;
			}

		});
		this.saveAllQuestions();
	}

	@action
	moveQuestionDown(question) {
		const position = question.orderNr;
		this.questions.forEach((q) => {
			if (q.orderNr == position) {
				q.orderNr++;
			} else if (q.orderNr == position + 1) {
				q.orderNr--;
				console.error('calc');
			}
		});
		this.saveAllQuestions();
	}
}
