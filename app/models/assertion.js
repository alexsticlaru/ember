import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

export default Model.extend( {
	session: service(),

	issue: belongsTo('issue'),
	root: belongsTo('assertion', { inverse: 'assertions', async: false }),
	assertions: hasMany('assertion', {
		inverse: 'root'
	}),
	// Foreign attributes
	type:'assertion',

	title: attr('string'),
	text: attr('string'),
	originalText: attr('string'),
	content: belongsTo('comment', { inverse: 'assertions', async: true }),
	date: attr('date'),
	status: attr('string'),
	locale: attr('string'),
	globalRelevancy: attr('number'),
	type: attr('string'),
	addedBy: belongsTo('user'),
	globalRelevancyScore: attr('number'),
	clusterGlobalRelevancyScore: attr('number'),

	//former ratable mixin
	globalRelevancy: attr('number', { defaultValue: 0 }),
	userRelevancy:   attr('number', { defaultValue: 0 }),
	isUpvoted: computed('userRelevancy', 'session.isAuthenticated', function () {
		if ( this.get('session.isAuthenticated') ) {
			return this.get('userRelevancy') > 0 ;
		} else {
			return false;
		}
	}),

	isDownvoted: computed('userRelevancy', 'session.isAuthenticated', function () {
		if ( this.get('session.isAuthenticated') ) {
			return this.get('userRelevancy') < 0 ;
		} else {
			return false;
		}
	}),

});
