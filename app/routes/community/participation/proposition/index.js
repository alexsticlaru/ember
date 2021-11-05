import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../../../../config/environment';
import { action } from '@ember/object';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default class CommunityParticipationPropositionIndexRoute extends Route.extend(RouteMixin) {
	@service analytics;
	@service meta;
	@service phone;
	@service('popup') popupService;
	@service('user') userService;
	@service loginRender;

	isMapMode = false;

	filters = {
		sort: 'date'
	};

	model(params) {
		const parentModel = this.modelFor('community.participation.proposition');
		params['filters[participationPack]'] = parentModel.participationPack.id;
		params['v7'] = true;
		if (this.filters.sort) {
			params['filters[order_by]'] = this.filters.sort;
		}
		if (this.filters.theme) {
			params['filters[theme]'] = this.filters.theme;
		}
		if (this.filters.searchText) {
			params['filters[searchText]'] = this.filters.searchText;
		}
		if (this.filters.relevancy) {
			params['filters[relevancy]'] = this.filters.relevancy;
		}
		if (this.isMapMode) {
			if (!this.filters.relevancy) {
				params['filters[relevancy]'] = [];
			}
			if (!params['filters[relevancy]'].includes('map')) {
				params['filters[relevancy]'].push('map');
			}
		}

		let propositions = this.findPaged('proposition', params);

		// return directly without using promises or RSVP,
		// so the template can check the loading state of propositions using model.propositions.isFulfilled
		return {
			propositions: propositions,
			participationPack: parentModel.participationPack,
			themes: parentModel.themes,
			project: parentModel.project,
			community: parentModel.community,
			ideaBox: parentModel.ideaBox,
		};
	}

	@action
	willTransition() {
		this.phone.hidePhonePage();
	}

	renderTemplate(controller, model) {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.phone.showPhonePage('community.participation.phone.proposition', model, 'community.participation.proposition.index');
		} else {
			this.render();
		}
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Community Idea Box'});
	}

	@action
	setFilters(filters) {
		this.filters = filters;
		this.refresh();
	}

	@action routeSetMapMode(mapMode) {
		this.isMapMode = mapMode;
		this.refresh();
	}

	@action updateFilters(sortType, themesToFilter, relevancyFilter, searchText) {
		delete this.filters.theme;
		if (themesToFilter) {
			this.filters.theme = themesToFilter;
		}

		delete this.filters.searchText;
		if (searchText) {
			this.filters.searchText = searchText;
		}

		delete this.filters.relevancy;
		if (relevancyFilter) {
			this.filters.relevancy = relevancyFilter;
		}

		this.filters.sort = sortType;

		this.refresh();
	}

	@action updateSearch(searchText) {
		delete this.filters.searchText;
		if (searchText) {
			this.filters.searchText = searchText;
		}
		this.refresh();
	}

	@action refreshModel() {
		this.refresh();
	}

	setupController(controller, model) {
		super.setupController(controller, model);

		// workaround, list is not otherwise updated on the idea box phone search side panel
		this.controllerFor('community.participation.phone.proposition-search').set('model', model);
	}
}
