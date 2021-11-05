import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommunitySettingsAddProjectController extends Controller {
  @service router;

  @action onProjectAdded() {
    this.router.transitionTo("community");
  }

}
