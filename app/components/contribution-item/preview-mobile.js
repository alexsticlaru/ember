import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContributionPreviewComponent extends Component {
  @service reactions;

	@action showReactions(comment) {
		this.reactions.showReactionsPopup(comment);
	}

  @action showConversationTab() {
    // this.transitionToRoute('act.contribution',
    //   this.args.model.project.community.get("url"),
    //   this.args.model.project.url,
    //   this.args.model.participationPack.id,
    //   this.args.comment.id);
	}

}
