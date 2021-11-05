import Controller from '@ember/controller';
import config from '../../../config/environment';


export default class EventsController extends Controller {

	get config() {
		return config;
	}

	get breadCrumbs() {
		return [
			{
				label: this.model.project.community.content.name,
				routeName: 'community',
				models: [ this.model.project.community.get('url')],
				linkable: true
			},
			{
				label: this.model.project.name,
				routeName: 'community.participation',
				models: [ this.model.project.community.get('url'), this.model.project.url],
				linkable: true
			},
			{
				label: 'Events',
				linkable: false
			},
		]
	}
}
