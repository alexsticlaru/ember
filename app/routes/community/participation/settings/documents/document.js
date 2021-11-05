import Route from '@ember/routing/route';

export default class CommunityParticipationSettingsDocumentsDocumentRoute extends Route {

  async model(params) {
    // const links = this.store.findRecord('links', params.document_id);
    return this.store.findRecord('section', params.document_id);
  }

}
