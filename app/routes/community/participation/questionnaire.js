import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../../../config/environment';
import { action } from '@ember/object';
import { A } from '@ember/array';
import RSVP from 'rsvp';

export default class QuestionnaireRoute extends Route {

	@service analytics;
	@service meta;
	@service phone;
	@service('popup') popupService;
	@service('user') userService;
	@service sidePanel;
	@service loginRender;

    renderTemplate(controller, model) {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.phone.showPhonePage('community.participation.questionnaire.phone.questionnaire', model, 'community.participation.questionnaire');
		} else {
			this.render();
		}
	}

	@action
	willTransition(transition) {
		if (this.currentModel.questionnaireStarted) {
			transition.abort();
			const cleanAnswers = () => {
				this.removePartialSavedAnswers(this.currentModel.partialSavedAnswers);
				this.currentModel.questionnaireStarted = false;
				transition.retry();

			}

			if (window.innerWidth <= config.breakpoints.phone) {
				this.sidePanel.showSidePanel('community.participation.questionnaire.phone.questionnaire-leave',
				{ onLeaveQuestionnaire: cleanAnswers },
				'community.participation.questionnaire.questionnaire-leave');
			} else {
				this.popupService.showPopup("community.participation.questionnaire.questionnaire-leave",
					{ onLeaveQuestionnaire: cleanAnswers }
					, "community.participation.questionnaire.questionnaire-leave");
			}
		} else {
			this.phone.hidePhonePage();
			this.sidePanel.hideSidePanel();
			this.popupService.close();
		}
    }

	removePartialSavedAnswers(partialSavedAnswers) {
		partialSavedAnswers.forEach((savedAnswer) => {
			const questRecord = this.store.peekRecord('quest-record', savedAnswer.id);
			questRecord.deleteRecord();
			questRecord.save();
		});
	}

    async model(params) {
		const questionnaireModule = this.store.peekRecord('participation-pack', params.questionnaire_id);
		const questionnaire = await questionnaireModule.questionnaire;
		//TODO remove title, description, image assigement when BE save them on quest-form entity
		questionnaire.title = questionnaireModule.title;
		questionnaire.description = questionnaireModule.description;
		questionnaire.image = questionnaireModule.image;
		const partialSavedAnswers = A([]);
		await this.requestStartPosition(questionnaire);
		if (!questionnaire.userDidComplete && this.userService.isAuthenticated) {
			this.loadQuestionnaireProgress(questionnaire, partialSavedAnswers);
		}

        const communityModel = this.modelFor('community');
        return {
			questionnaireModule,
            questionnaire,
			partialSavedAnswers,
            community: communityModel.community,
            project: communityModel.projects.firstObject,
			questionnaireStarted: false
        }
    }

	loadQuestionnaireProgress(questionnaire, partialSavedAnswers) {
		questionnaire.questions.forEach((question) => {
			this.store.query('quest-record', {
				"filters[question]": question.id
				// backend now automatically filters for the current user
				// "filters[user]": this.userService.getCurrentUser().id
			})
				.then(
					async (questRecords) => {
						if (questRecords.length > 0) {
							const savedQuestRecords = await this.convertQuestRecords(questRecords);
							partialSavedAnswers.addObjects(savedQuestRecords);
						}
					}
			)
		});
	}

	async convertQuestRecords(questRecords) {
		const promises = questRecords.map(async (questRecord) => {
			const question = await questRecord.question;
			const answer = await questRecord.answer;
			const attachment = await questRecord.attachment;
			return {
				id: questRecord.id,
				timing: questRecord.timing,
				answerText: questRecord.answerText,
				openAnswer: questRecord.openAnswer,
				orderNumber: questRecord.orderNumber,
				question,
				answer,
				attachment
			}
		});
		const resolvedPromises = await RSVP.all(promises);
		return resolvedPromises;
	}

	async requestStartPosition(questionnaire) {
		if (questionnaire.startAtQuestion === undefined) {
			// if we don't have the field, re-request the questForm from the back-end
			let questForms = await this.store.query('quest-form', {
				id: questionnaire.id,
				"infos[position]": 1
			});
			questionnaire.startAtQuestion = questForms.firstObject.startAtQuestion;
			questionnaire.userDidComplete = questForms.firstObject.userDidComplete;
			this.setupCurrentStep(questionnaire);
		}
	}

	setupCurrentStep(questionnaire) {
		let step = 0;
		let currentStep = 0;
		questionnaire.questions.sortBy('orderNr').forEach((question, index) => {
			if (question.fieldType !== 'statement') {
				step++;
			}

			if (index === questionnaire.startAtQuestion - 1) {
				currentStep = step;
			}
		});
		const firstQuestionType = questionnaire.questions.firstObject.fieldType;
		questionnaire.currentStep = questionnaire.startAtQuestion !== -1 ? firstQuestionType === 'statement' ? currentStep : currentStep - 1 : 0;
	}

    afterModel(model) {
		// either the user must be authenticated, or the questionnaire has the setting to allow anonymous/unauthenticated users
		if (!model.questionnaire.allowAnonymousUsers && !this.userService.isAuthenticated) {
			this.transitionTo('community.participation').then(() =>
				this.loginRender.renderDeviceSpecificLogin()
			);
			return;
		}

		this.analytics.trackPiwikPageView(window.location.href);

		//Add Meta Tags for Sharing
		const title = model.questionnaire.title ? model.questionnaire.title : "Civocracy";
		const description = model.questionnaire.description ? model.questionnaire.description : "Participate at Civocracy";
		const image = model.questionnaire.image ? "https://res.cloudinary.com/civocracy/image/upload/" + model.questionnaire.image : "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

		this.meta.addMetaTags({
			title,
			description,
			image
		});


	}
}
