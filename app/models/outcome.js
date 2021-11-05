import { inject as service } from '@ember/service';
import { equal, empty } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

export default Model.extend( {
	session: service(),
	intl: service(),

	type:'outcome',

	init: function () { this.get('intl') ; }, // Load intl. Needed for observers.

	user: belongsTo('user'),//doesn't appear : outcome are always posted as org by te community'
	// issue: belongsTo('issue'),
	issue: belongsTo('issue', { inverse: null }),
	postedAsOrg: true,

	assertions: hasMany('assertion', {
		inverse: 'content'
	}),
	locale: attr('string'),
	localeOriginal: attr('string'),
	title: attr('string'),
	cleanTitle: computed('title', function(){
		return this.get('title').replace(/<\/?[^>]+(>|$)/g, "");
	}),
	content: attr('string'),
	translated: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	titleOriginal: attr('string'),
	contentOriginal: attr('string'),

	seenCount: attr('number'),
	seenCountUser: attr('number'),

	//former ratable mixin
	globalRelevancy: attr('number', { defaultValue: 0 }),
	userRelevancy:   attr('number', { defaultValue: 0 }),

	badges: attr(),

	status: attr('string'),

	community: belongsTo('community'),

	isRoot: empty('root'),

	date: attr('date', {
		deserialize: true
	}),

	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),
	calendarDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).calendar() ;
	}),
	// Don't send content tracking
	// request twice.
	viewed: false,
	attachments: hasMany('comment-attachment', {
		inverse: 'content'
	}),

	//reactions :
	comments: hasMany('comment', {//comments on the outcome from users
		inverse: 'root'
	}),
	reactionCount: attr('number', { defaultValue: 0 }),
	reaction1Count: attr('number', { defaultValue: 0 }),
	reaction2Count: attr('number', { defaultValue: 0 }),
	reaction3Count: attr('number', { defaultValue: 0 }),
	reaction4Count: attr('number', { defaultValue: 0 }),
	reaction5Count: attr('number', { defaultValue: 0 }),
	commentCount: attr('number', { defaultValue: 0 }),
	userReactionType: attr('string'),

	bookmark: belongsTo('contribution-bookmark'),
});
