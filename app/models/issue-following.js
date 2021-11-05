import { inject as service } from '@ember/service';
import { gt } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import DS from 'ember-data' ;

const {
	Model,
	attr,
	belongsTo,
} = DS ;

export default Model.extend({

	intl: service(),

	/**
	 * Load services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	isAdmin: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	communityAdminLevel: attr('number', {
		defaultValue() {
			return 0;
		}
	}),
	isCommunityAdmin: gt('communityAdminLevel', 0),
	adminLevel: attr('number'),
	introMessageCountSeen: attr('number', {
		defaultValue() {
			return 0;
		}
	}),
	issue: belongsTo('issue'),
	notificationsCount: attr('number'),
	status: attr('string'),
	user: belongsTo('user'),

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow();
	}),

	dateVisit: attr('date'),
	displayDateVisit: computed('date', 'intl.locale', function () {
		return moment(this.get('dateVisit')).fromNow();
	}),
}) ;

