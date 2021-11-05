import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class AddOutcomeDesktop extends Component {
  @service('user') userService;
  @tracked commentContent = null;
  @tracked isExpanded = false;

  @action
  addComment() {
    this.args.proposition.outcome = this.outcomeContent;
    this.args.proposition.save();
  }

  @action
  expandForm() {
    this.isExpanded =true;
  }

}
