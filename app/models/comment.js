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

	init: function () { this.get('intl') ; }, // Load intl. Needed for observers.

	user: belongsTo('user'),
	// issue: belongsTo('issue'),
	issue: belongsTo('issue', { inverse: null }),

    proposition: belongsTo('proposition'),
	postedAsOrg: attr('boolean'),
	root: belongsTo('comment', { inverse: 'comments', async: false }),
	comments: hasMany('comment', {
		inverse: 'root'
	}),
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
	isDirectResult: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	seenByOrg: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	seenCount: attr('number'),
	seenCountUser: attr('number'),
	userRatingId: attr('number'),

	// Foreign attributes
	type:'comment',
	themes: hasMany('theme'),


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

	badges: attr(),

	isMarkedAsConstructive: computed('badges', function () {
		if (!this.get('badges')) {
			return false;
		}
		return this.get('badges').includes('topDown');
	}),

	status: attr('string'),
	moderationStatus: attr('string'),
	moderationMessage: attr('string'),
	isValidated: equal('moderationStatus', 'validated'),
	isModerated: equal('moderationStatus', 'moderated'),
	isFlagged: computed('moderationStatus', function() {
		return this.get('moderationStatus') === 'flagged' || this.get('moderationStatus') === 'flagged_auto';
	}),
	reports: hasMany('comment-report'),

	changeModerationStatus: function (statusChangeType, message) {
		const adapter = this.store.adapterFor(this.constructor.modelName) ;
		const _this = this ;
		return adapter.changeModerationStatus(this, statusChangeType, message).then( function () {
			// FIXME should be done by back-end
			// _this.set('status', statusChangeType) ;
		}) ;
	},

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

	anonymous: attr('boolean'),
	anonymousSeed: attr('number'),

	// Don't send content tracking
	// request twice.
	viewed: false,
	highlighted: attr('boolean'),
	attachments: hasMany('comment-attachment', {
		inverse: 'content'
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
