import { inject as service } from '@ember/service';
import { equal, or } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data' ;


const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({

	intl: service(),

	type:'community-following',


	adminLevel: attr('number'),
	introMessageCountSeen: attr('number'),
	notificationsCount: attr('number'),
	status: attr('string'),
	user: belongsTo('user'),
	changeAdminLevel: attr('boolean'),

	community: belongsTo('community', {
		inverse: null
	}),

	date: attr('date'),
	displayDate: computed('date', 't.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),

	dateVisit: attr('date'),
	displayDateVisit: computed('date', 'intl.locale', function () {
		return moment( this.get('dateVisit') ).fromNow() ;
	}),

	isOwner: equal('adminLevel', 2),
	isAdmin: equal('adminLevel', 1),
	isCommunityAdmin: or('isOwner', 'isAdmin'),

	setAdminLevel: function (newAdminLevel) {
// alert('model community-following : setAdminLevel('+newAdminLevel+')');
		const adapter = this.store.adapterFor(this.constructor.modelName) ;
		return adapter.setAdminLevel(this, newAdminLevel);
	},

}) ;
