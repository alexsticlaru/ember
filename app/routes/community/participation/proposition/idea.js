import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CommunityParticipationPropositionIdeaRoute extends Route {
  @service meta;
  @service analytics;
  @service toast;
  @service intl;

  async model(params) {

    const parentModel = this.modelFor('community.participation.proposition');
    const proposition = await this.store.findRecord('proposition', params.idea_id);

    if (proposition.participationPack.get("id") != parentModel.participationPack.id) {
      this.toast.error(this.intl.t('bubble.error.404'));
      this.transitionTo('community.participation.proposition');
    }

    //the number of upvotes needed after which an idea is open for dicscussion:
    // const upvotesNeeded = proposition.participationPack.get("ideaBox.upvotesNeeded");
    // if (proposition.globalRelevancy < upvotesNeeded) {
    //   this.toast.error(this.intl.t('bubble.error.404'));
    //   this.transitionTo('community.participation.proposition');
    // }

    return proposition;
  }

  afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Community Idea Box'});
	}

}
