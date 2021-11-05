import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class QuestionnaireController extends Controller {
    @service intl;
    @service share;
    @service phone;
    @service store;
    @service router;
    @service('user') userService;
    @tracked showQuestions = false;
    @tracked anonymousUser;

    get breadCrumbsMainPage() {
        return [
            {
                label: this.model.community.name,
                routeName: 'community',
                models: [ this.model.community.url],
                linkable: true
            },
            {
                label: this.model.project.name,
                routeName: 'community.participation',
                models: [this.model.community.url, this.model.project.url],
                linkable: true
            }
        ]
    }

    get minLong(){
        const seconds = this.model.questionnaire.questions.reduce((acc, question) => {
            switch(question.fieldType) {
                case 'statement':
                    return acc + 10;
                case 'multiple_choices':
                    return acc + 10;
                case 'order_choice':
                    return acc + 20;
                case 'choice':
                    return acc + 10;
                case 'yes_no':
                    return acc + 10;
                case 'text':
                    return acc + 120;
                case 'text_attachment':
                    return acc + 130;
                case 'range':
                    return acc + 60;
                case 'email':
                    return acc + 30;
                default:
                    return acc + 10;
            }
        }, 0);

        return Math.ceil(seconds/60);

    }

    @action
    async startQuestionnaireOnPhone() {
        this.model.questionnaireStarted = true;
        this.phone.showPhonePage('community.participation.questionnaire.phone.questionnaire-questions', this.model, 'community.participation.questionnaire.phone.questionnaire-questions');

		if (!this.userService.isAuthenticated) {
			this.anonymousUser = this.store.createRecord('quest-anon-user');
			await this.anonymousUser.save();
		}
        this.store.createRecord('quest-form-tracking', {
            user: this.userService.getCurrentUser(),
			anonymousUser: this.anonymousUser,
            content: this.model.questionnaire,
            useCase: 'seen'
         }).save()
    }

    @action
    async startQuestionnaire() {
		if (!this.userService.isAuthenticated) {
			this.anonymousUser = this.store.createRecord('quest-anon-user');
			await this.anonymousUser.save();
		}

        this.model.questionnaireStarted = true;
        this.showQuestions = true;
        this.store.createRecord('quest-form-tracking', {
            user: this.userService.getCurrentUser(),
			anonymousUser: this.anonymousUser,
            content: this.model.questionnaire,
            useCase: 'seen'
         }).save()
    }

    @action
    seeResults() {
        this.router.transitionTo('community.participation.questionnaire.questionnaire-results');
        const topHeaderElm = document.getElementById("top-header")
        const scrollOptions = {
            left: 0,
            top: topHeaderElm.offsetHeight === 65 ? 840 : 880,
            behavior: 'smooth'
          }
        window.scroll(scrollOptions);
    }

    @action
    seeResultsOnPhone() {
        this.router.transitionTo('community.participation.questionnaire.questionnaire-results');
    }

    @action
    shareQuestionnaire() {
      const shareModel = {
        url: window.location.href,
        popupTitle: this.intl.t('ideaBox.shareButton.questShare'),
        shareMessage: this.intl.t('ideaBox.shareButton.messageQuest')
      };

      this.share.showPopup(shareModel);
    }

}
