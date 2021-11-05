import { inject as service } from '@ember/service';
import config from 'civ/config/environment';
import { pluralize } from 'ember-inflector';
import { computed } from '@ember/object';
import RESTAdapter from "@ember-data/adapter/rest";

/**
 * @class ApplicationAdapter
 * @constructor
 * @extends Ember.RESTAdapter
 */
export default class ApplicationAdapter extends RESTAdapter {

	// entities related to the new v7 platform, which are in the /v7/ url namespace on the backend
	v7Entities = ['project', 'participation-pack', 'participation-pack-theme', 'proposition-bookmark', 'comment-reaction', 'quest-record-attachment', 'project-following', 'translation-string', 'project-update', 'contribution-bookmark', 'quest-anon-user', 'idea-box', 'frontend-error', 'project-event', 'project-event-following'];
	host = config.APP.API_HOST + '/api';

	@service session;

	@computed('session.data.authenticated.access_token')
	get headers() {
	  let headers = {};
	  if (this.session.isAuthenticated) {
		// OAuth 2
		headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
	  }
	  return headers;
	}

	handleResponse(status, headers, payload, requestData) {
		if (status === 401 && this.session.isAuthenticated) {
		  this.session.invalidate();
		}

		if (headers['x-total-count']) {
			let meta = {
				total_count: headers["x-total-count"],
				total_pages: headers["x-page-count"]
			};
			payload.meta = meta;
		}

		return super.handleResponse(...arguments);
	}

	/**
	 * override backend url per entity
	 * the standard Ember way has dashes between multiple words, remove them
	 * @param type
	 * @returns {string}
	 */
	pathForType(type) {
		// remove dashes
		const regex = new RegExp('-', 'g');
		let path = type.replace(regex, '');

		// pluralize
		path = pluralize(path);

		// new entities are in the /v7/ url namespace
		if (this.v7Entities.includes(type)) {
			path = 'v7/' + path;
		}

		// PB entities
		if (type == 'participatory-budget' || type.startsWith('pb-')) {
			path = 'pb/' + path;
		}

		// PM entities
		if (type.startsWith('pm-')) {
			path = 'pm/' + path;
		}

		return path;
	}

}
