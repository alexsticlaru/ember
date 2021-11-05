import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class QuestionnaireEndController extends Controller {
    @service router;

    get breadCrumbs() {
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

    @action
    closeSidePanel() {
		this.router.transitionTo("community.participation.index");
    }

    @action
    backToProject() {
        this.router.transitionTo('community.participation');
    }

    @action
    seeResults() {
        this.router.transitionTo('community.participation.questionnaire.questionnaire-results');
    }
}