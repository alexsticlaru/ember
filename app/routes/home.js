import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class Home extends Route {
	@service analytics;
	@service('community') communityService;
	@service ('user') userService;
	@service meta;
	@service('debug') dbgS;
	@service intl;

	/**
	 * FIXME: FOE Security Jam 2017
	 * Redirect to FOE page if URL is not civocracy.org
	 * @method redirect
	 */
	redirect() {
		super.init(...arguments);
		const routeName = 'community'
		const host = window.location.hostname ;
		/*Redirect specific clients that want to change their community slug without losing their initial slug for some time (see also routes/community.js) :*/
		let slug = window.location.pathname.substr(1) ;
		if( slug.indexOf('/')>-1 ) {
			slug = slug.substr(0, slug.indexOf('/'));
		}

		if ( window.location.pathname === '/' ) {
			if ( host === 'www.debatingsecurityplus.org' ) {
				this.replaceWith(routeName, 'dsplus') ;
			} else if ( host === 'jeparticipe.auvergnerhonealpes.fr' ) {
				this.replaceWith(routeName, 'auvergne-rhone-alpes') ;
			} else if ( host === 'www.engagecall.com' ) {
				this.replaceWith(routeName, 'engagecall') ;
			}
		}

		if( slug === 'ambitionterritoires2030' ){
			this.replaceWith(routeName, 'SRADDET') ;
		}


		if ( /*no homepage for now => go to communities in any case - this.userService.isAuthenticated &&*/ this._router.url === "/") {
			this.transitionTo('communities');
		}
	}

	beforeModel() {
		this.communityService.invalidateCurrentCommunity();
	}

	model() {
		const locationMapCommunities = this.store.query('community', {
			"order_by[best]": "DESC",
			"filters[isActive]": 1,
			"filters[isSubpage]": 0,
			"specialFilters[communityTree]": 1,
			"limit": "100"
		});

		return locationMapCommunities;
		// return [];
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags(this.metaFields);
	}

	get metaFields() {
		return {
			title: 'Civocracy',
			description: this.intl.t('home.header.title') + ' ' + this.intl.t('home.header.subtitle') + ' ' + this.intl.t('home.header.sliding.item.1') + '.',
			image: "https://res.cloudinary.com/civocracy/image/upload/w_600,h_315,c_fill,q_auto,f_auto,g_auto/l_civ,w_80,g_north_east/v1473327429/static/home4.jpg"
		} ;

	}
}
