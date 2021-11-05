import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PropositionManagementVisibilityComponent extends Component {

  get isPublic() {
    return this.args.participationPack.visibility == "public";
  }

  get isConfidential() {
    return this.args.participationPack.visibility == "confidential";
  }

  @action	setVisibilityPublic() {
    this.args.participationPack.visibility = "public";
  }

  @action	setVisibilityConfidential() {
    this.args.participationPack.visibility = "confidential";
  }


}
