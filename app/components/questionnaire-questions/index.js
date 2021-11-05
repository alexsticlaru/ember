import Component from '@glimmer/component';
import config from '../../config/environment';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import QuestRecord from '../../models/quest-record';

export default class QuestionnaireQuestionsComponent extends Component {
    @service store;
	@service popup;
    @service sidePanel;
    @service('user') userService;
    @service router;
    @tracked currentQuestionOrderNr = this.args.model.questionnaire.startAtQuestion && this.args.model.questionnaire.startAtQuestion !== -1 ? this.args.model.questionnaire.startAtQuestion : 1;
    @tracked currentStep = this.args.model.questionnaire.currentStep ? this.args.model.questionnaire.currentStep : 0;
    @tracked currentQuestionsAnswers = A([]);
    @tracked isQuestionnnaireSubmitted = false;
    totalSteps = 0;
    questionnaireAnswers = [];

    get config() {
        return config;
    }

    get questionsSortByOrder() {
        let questionNr = 0;
        const questions = this.args.model.questionnaire.questions.sortBy('orderNr').map((question) => {
            if (question.fieldType !== 'statement') {
                question.questionNr = ++questionNr;
            }

            return question;
        });
        this.totalSteps = questions.firstObject.fieldType === 'statement' ? questionNr : questionNr - 1;
        return questions;
    }

    get isSubmit() {
        return this.currentQuestionOrderNr === this.args.model.questionnaire.questions.length;
    }

    get progress() {
        return `width: ${this.currentStep/this.totalSteps * 100}%`;
    }

    get isQuestionRequired() {
        const question = this.questionsSortByOrder.findBy('orderNr', this.currentQuestionOrderNr);
        const foundQuestion = this.args.model.partialSavedAnswers.find((questAnswer) => questAnswer.question.orderNr === this.currentQuestionOrderNr);
        return question ? question.required && this.currentQuestionsAnswers.length === 0 && !foundQuestion : false;
    }

    @action
    closeSidePanel() {
		this.router.transitionTo("community.participation.index");
    }

    @action
    previousQuestion() {
        this.currentQuestionOrderNr--;
        const question = this.questionsSortByOrder.findBy('orderNr', this.currentQuestionOrderNr);
        if (question && question.fieldType !== 'statement') {
            this.currentStep--;
        } else if (question && question.fieldType === 'statement' && this.currentQuestionOrderNr === 1) {
            this.currentStep--;
        }
        this.focusOnBody();
    }

    @action
    nextQuestion() {
        this.currentQuestionOrderNr++;
        const question = this.questionsSortByOrder.findBy('orderNr', this.currentQuestionOrderNr);
        if (question && question.fieldType !== 'statement') {
            this.currentStep++;
            this.saveQuestionAnswers();
        } else if (this.currentQuestionOrderNr > this.questionsSortByOrder.length) {
            this.saveQuestionAnswers();
        }
        this.focusOnBody();
    }

    @action
    addAnswer(questAnswer) {
        this.currentQuestionsAnswers.pushObject(questAnswer);
    }

    @action
	updateAnswer(questAnswer) {
		const foundQuestAnswer = this.currentQuestionsAnswers.findBy('id', questAnswer.id);
        if (!foundQuestAnswer) {
            this.currentQuestionsAnswers.pushObject(questAnswer);
        }

	}

    @action
    removeQuestionAnswers(questionId) {
        this.currentQuestionsAnswers = [];
        const questionSavedAnswers = this.args.model.partialSavedAnswers.filter((questRecord) => questRecord.question.id === questionId);
        questionSavedAnswers.forEach((questR) => {
            const questRecord = this.store.peekRecord('quest-record', questR.id);
            questRecord.deleteRecord();
            questRecord.save();
            this.args.model.partialSavedAnswers.removeObject(questR);
        });
    }

    @action
    removeAnswer(id, savedQuestRecordId) {
        this.currentQuestionsAnswers = this.currentQuestionsAnswers.rejectBy('id', id);
        this.removeSavedAnswer(id, savedQuestRecordId);
    }

    removeSavedAnswer(id, savedQuestRecordId) {
        const foundAnswer = this.args.model.partialSavedAnswers.find((questRecord) => {
            if (savedQuestRecordId) {
                return questRecord.id === savedQuestRecordId;
            } else if (questRecord.answer) {
                return `${questRecord.question.id}-${questRecord.answer.id}` === id
            }
        });
        if (foundAnswer) {
            const questRecord = this.store.peekRecord('quest-record', foundAnswer.id);
            questRecord.deleteRecord();
            questRecord.save();
            this.args.model.partialSavedAnswers.removeObject(foundAnswer);
        }
    }

    saveQuestionAnswers() {
        const endQuestion = new Date();
        this.currentQuestionsAnswers.forEach((questAnswer) => {
            const questRecord = this.prepareRecordForSave(questAnswer, endQuestion);
            questRecord.save().then((savedQuestRecord) => {
                if(questAnswer.attachmentToSave) {
                    questAnswer.attachmentToSave.content = savedQuestRecord;
                    questAnswer.attachmentToSave.save();
                }
                this.addToPartialSavedAnswers(savedQuestRecord);
            });
        });
        this.currentQuestionsAnswers = [];
    }

    prepareRecordForSave(questAnswer, endQuestion) {
        if(questAnswer instanceof QuestRecord) {
            this.args.model.partialSavedAnswers = this.args.model.partialSavedAnswers.rejectBy('id', questAnswer.id);
            questAnswer.timing = this.computeTimeElipsed(endQuestion, questAnswer.startQuestion);
            return questAnswer;
        } else {
            return this.store.createRecord('quest-record', {
                answer: questAnswer.answer,
                question: questAnswer.question,
                user: this.userService.getCurrentUser(),
				anonymousUser: this.args.anonymousUser,
                timing: this.computeTimeElipsed(endQuestion, questAnswer.startQuestion),
                answerText: questAnswer.answerText,
                openAnswer: questAnswer.openAnswer,
                attachment: questAnswer.attachment,
                orderNumber: questAnswer.orderNr
            });
        }
    }

    async addToPartialSavedAnswers(questRecord) {
        const question = await questRecord.question;
        const answer = await questRecord.answer;
        const attachment = await questRecord.attachment;
        this.args.model.partialSavedAnswers.pushObject({
            id: questRecord.id,
            timing: questRecord.timing,
            answerText: questRecord.answerText,
            openAnswer: questRecord.openAnswer,
            question,
            answer,
            attachment
        });
    }

    computeTimeElipsed(endTime, startTime) {
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;
        return  Math.round(timeDiff);
    }

    focusOnBody() {
      if (document.getElementById('questionsBody')) {
          document.getElementById('questionsBody').focus();
      }
    }

    @action
    submitQuestionnaire() {
        this.args.model.questionnaireStarted = false;
        this.isQuestionnnaireSubmitted = true;
        this.saveQuestionAnswers();
        this.store.createRecord('quest-form-tracking', {
            user: this.userService.getCurrentUser(),
			anonymousUser: this.args.anonymousUser,
            content: this.args.model.questionnaire,
            useCase: 'completed'
         }).save()
    }

    @action
    submitPhoneQuestionnaire() {
        this.args.model.questionnaireStarted = false;
        this.sidePanel.showSidePanel('community.participation.questionnaire.phone.questionnaire-end', this.args.model, 'community.participation.questionnaire.phone.questionnaire-end');
        this.store.createRecord('quest-form-tracking', {
            user: this.userService.getCurrentUser(),
			anonymousUser: this.args.anonymousUser,
            content: this.args.model.questionnaire,
            useCase: 'completed'
         }).save()
    }

    @action
    backToProject() {
        this.router.transitionTo('community.participation');
    }
}
