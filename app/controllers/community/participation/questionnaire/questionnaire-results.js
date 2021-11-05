import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class QuestionnaireResultsController extends Controller {

    @service('user') userService;
    @service router;

    get user() {
        return this.userService.getCurrentUser();
    }

    @action
    backToProject() {
        this.router.transitionTo('community.participation');
    }

}