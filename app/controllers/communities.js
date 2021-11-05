import Controller from '@ember/controller';
import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);

export default class CommunitiesController extends Controller {
	title = 'Communities Page';
	constructor() {
		super(...arguments);
	}

	get activeCommunities(){
		let activeV7Communities = [];
		let activeCommunities = [];
		this.model.forEach(function(item) {
			//we want here only the communities that are shown on the map on www.civocracy.org
			if ( !item.isSubpage && item.isActive && item.status === 'active' && item.globalRelevancy > 10/*more than 10 members...*/ && item.latitude && item.longitude ) {
				if( item.v7redirect )activeCommunities.unshift(item);
				else activeCommunities.push(item);
			}
		});
		return activeCommunities;
	}
}
