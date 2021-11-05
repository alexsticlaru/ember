import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from '../../../../config/environment';

export default class QuestionnaireResultsRoute extends Route {

	@service phone;
	@service('popup') popupService;
	@service('user') userService;
	@service loginRender;

    beforeModel(transition) {
		if(!this.userService.isAuthenticated) {
			transition.abort();
			this.transitionTo('community', transition.resolvedModels.community.community.url).then(() => 
				this.loginRender.renderDeviceSpecificLogin()
			);
		}
    }

    renderTemplate(controller, model) {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.phone.showPhonePage('community.participation.questionnaire.phone.questionnaire-results', model, 'community.participation.questionnaire.questionnaire-results');
		} else {
			this.render();
		}
	}

    @action
	willTransition() {
        this.phone.hidePhonePage();
    }

    async model() {
		const parentModel = this.modelFor('community.participation.questionnaire');
        this.loadQuestionnaireResults(parentModel.questionnaire);
        return {
            questionnaire: parentModel.questionnaire,
            community: parentModel.community,
            project: parentModel.project
        }
    }
    
    loadQuestionnaireResults(questionnaire) {
		questionnaire.questions.forEach(async (question) => {
			if (question.fieldType === 'statement') {
				return;
			}
			let answerResult = await this.store.query('quest-answer-result', {
				"filters[question]": question.id
			});

			question.results = answerResult;
		});
	}

}