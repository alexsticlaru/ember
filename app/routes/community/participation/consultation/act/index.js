import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import RSVP from 'rsvp';
import config from '../../../../../config/environment';
import {action} from '@ember/object';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default class ActIndexRoute extends Route.extend(RouteMixin) {

	@service analytics;
	@service meta;
	@service phone;
	@service session;
	@service('popup') popupService;
	@service router;

	filters = {
		sort: 'date'
	};

	@action
	willTransition() {
		this.phone.hidePhonePage();
	}

	renderTemplate(controller, model) {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.phone.showPhonePage('community.participation.consultation.act.phone.consultation-act', model, 'community.participation.consultation.act.index');
		} else {
			this.render();
		}
	}

	async model(params) {
		const parentModel = this.modelFor('community.participation.consultation.act');
		const issueId = parentModel.issue.id;
		params['filters[issue]'] = issueId;
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

		let comments = this.findPaged('comment', params);

		//filter the comments to only have the ones with an issue id
		//and not the comment responses (responses have a root comment set but no issue)
		//but maybe its better to do this through the BE?
		// June 2021: I added a check for it in the template now and removed the JMS exclude in the Comment Entity	 * @var Comment $comments
		// else I had problems displaying the replies in the idea box module
		// might be a bit hacky but the pagination cli thing seems to not work else

		return RSVP.hash({
			issue: parentModel.issue,
			participationPack: parentModel.participationPack,
			project: parentModel.project,
			assertions: parentModel.assertions,
			profiles: parentModel.profiles,
			comments: comments
		});
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
	}

	@action
	setFilters(filters) {
		this.filters = filters;
		this.refresh();
	}
}
