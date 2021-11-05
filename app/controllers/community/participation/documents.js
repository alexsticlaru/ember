import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from '../../../config/environment';


export default class ParticipationDocumentsRoute extends Route {
	@service intl;
	get config() {
		return config;
	}

	get breadCrumbs() {
		return [
			{
				label: this.model.project.community.content.name,
				routeName: 'community',
				models: [ this.model.project.community.content.url],
				linkable: true
			},
			{
				label: this.model.project.name,
				routeName: 'community.participation',
				models: [this.model.project.community.content.url, this.model.project.url],
				linkable: true
			},
			{
				label: this.intl.t('breadcrumbs.documents'),
				linkable: false
			}
		]
	}

}
