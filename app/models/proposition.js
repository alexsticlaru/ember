import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import { get, computed } from '@ember/object';
import { isArray } from '@ember/array';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;
import config from 'civ/config/environment' ;

const {
	Model,
	AdapterError,
	belongsTo,
	hasMany,
	attr,
} = DS ;

export default Model.extend({

	intl:    service(),
	session: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attrs

	isNewlyAdded : false,
	status: attr('string'),
	moderationStatus: attr('string'),
	isValidated: equal('moderationStatus', 'validated'),
	isFlagged: equal('moderationStatus', 'flagged'),
	viewed: false, // Don't send content tracking request twice.
	// themes: hasMany('theme'),
	themes: hasMany('participation-pack-theme'),

	// Foreign attrs
	type:'proposition',
	comments: hasMany('comment'),
	issue: belongsTo('issue'),
	user: belongsTo('user'),
	community: belongsTo('community'),
	associations: hasMany('proposition-association'),
	reports: hasMany('proposition-report'),
	participationPack: belongsTo('participation-pack'),
	highlightProposition: attr('string'),

	icon: computed( 'highlightProposition', function (){
		//TO DO: make an svg file and load it here....
		const svg = '<svg width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M28.5564 13.3334C28.5564 22.321 17.0009 30.0247 17.0009 30.0247C17.0009 30.0247 5.44531 22.321 5.44531 13.3334C5.44531 10.2687 6.66277 7.32946 8.82986 5.16238C10.9969 2.99529 13.9361 1.77783 17.0009 1.77783C20.0656 1.77783 23.0048 2.99529 25.1719 5.16238C27.339 7.32946 28.5564 10.2687 28.5564 13.3334Z" fill="#FF7538" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.0003 17.1851C19.1276 17.1851 20.8521 15.4606 20.8521 13.3333C20.8521 11.206 19.1276 9.48145 17.0003 9.48145C14.873 9.48145 13.1484 11.206 13.1484 13.3333C13.1484 15.4606 14.873 17.1851 17.0003 17.1851Z" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d" x="-3" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="2"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>'

		const activesvg = '<svg width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M28.5564 13.3334C28.5564 22.321 17.0009 30.0247 17.0009 30.0247C17.0009 30.0247 5.44531 22.321 5.44531 13.3334C5.44531 10.2687 6.66277 7.32946 8.82986 5.16238C10.9969 2.99529 13.9361 1.77783 17.0009 1.77783C20.0656 1.77783 23.0048 2.99529 25.1719 5.16238C27.339 7.32946 28.5564 10.2687 28.5564 13.3334Z" fill="#FF7F47" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.0003 17.1851C19.1276 17.1851 20.8521 15.4606 20.8521 13.3333C20.8521 11.206 19.1276 9.48145 17.0003 9.48145C14.873 9.48145 13.1484 11.206 13.1484 13.3333C13.1484 15.4606 14.873 17.1851 17.0003 17.1851Z" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d" x="-3" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="2"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>';

		if (!this.get("highlightProposition")) {
			// this.set("iconUrl", "https://res.cloudinary.com/civocracy/image/upload/v1606143241/static/pm/marker-icon-2x-blue.png");
			this.set("iconUrl",'data:image/svg+xml;base64,' + btoa(svg));
		} else {
			this.set("iconUrl",'data:image/svg+xml;base64,' + btoa(activesvg));
		}

		return L.icon({
				className: 'edit-marker-icon',
				iconUrl: this.get("iconUrl"),
				// shadowUrl: 'https://res.cloudinary.com/civocracy/image/upload/v1606143243/static/pm/marker-shadow.png',
				// shadowSize:   [41, 41], // size of the shadow
				iconSize:     [34, 39], // size of the icon
				iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
				popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
		});
	}),


	moderationMessage: attr('string'),
	isModerated: equal('moderationStatus', 'moderated'),
	isFlagged: computed('moderationStatus', function() {
		return this.get('moderationStatus') === 'flagged' || this.get('moderationStatus') === 'flagged_auto';
	}),
	isFlaggedByCurrentUser: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),

	// Attrs with computed properties
	locale: attr('string'),
	title: attr('string'),
	description: attr('string'),
	localeOriginal:   '',
	titleOriginal: '',
	translated: false,
	content: attr('string'),
	latitude: attr('number'),
	longitude: attr('number'),


	date: attr('date'),
	dateLastActivity: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow() ;
	}),
	calendarDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).calendar() ;
	}),
	displayDateLastActivity: computed('dateLastActivity', 'date', 'intl.locale', function () {
		if ( this.get('dateLastActivity') != null ) {
			return moment(this.get('dateLastActivity')).fromNow() ;
		} else {
			return moment(this.get('date')).fromNow() ;
		}
	}),




	/**
	 * Upvotes count including the creator.
	 * @attribute globalRelevancy
	 * @type Number
	 */
	globalRelevancy: attr('number'),

	/**
	 * User rating (now upvote only).
	 * @attribute userRelevancy
	 * @type Number
	 */
	userRelevancy: attr('number'),

	bookmark: belongsTo('proposition-bookmark'),

	outcome: attr('string'),
	outcomeDate: attr('date'),
	displayOutcomeDate: computed('outcomeDate', 'intl.locale', function () {
		return moment(this.get('outcomeDate')).fromNow() ;
	}),

	/**
	 * Upvotes count excluding the creator.
	 * @attribute globalRelevancyMinusOne
	 * @type Number
	 */
	globalRelevancyMinusOne: computed('globalRelevancy', function () {
		let count = this.get('globalRelevancy') - 1 ;
		return count > 0 ? count : 0 ;
	}),

	/**
	 * Missing upvotes to open the discussion.
	 * @attribute localRelevancy
	 * @type Number
	 */
	peopleNeeded: computed('globalRelevancy', function () {
		//if(this.get('globalRelevancy') < 0)this.set('globalRelevancy', 0); -- not a good idea to set globalRelevancy here : results in multiple calls to globalRelevancyMinusOne() and an error in console... We need to handle the bug creating a bad count.
		let count = 50 - this.get('globalRelevancy') ;
		return count > 0 ? count : 0 ;
	}),

	/**
	 * Is Issue associated with proposition opened?
	 * @attribute isOpened
	 * @type Boolean
	 */
	isOpened: computed('issue', 'status', function () {
		const issueId = this.get('issue.id');
		const status = this.get('status');
		return status === "opened" && issueId !== undefined;
	}),

	/**
	 * Did the session user upvote the proposition?
	 * @attribute isUpvoted
	 * @type Boolean
	 */
	isUpvoted: computed('userRelevancy', 'session.isAuthenticated', function () {
		if ( this.get('session.isAuthenticated') ) {
			return this.get('userRelevancy') > 0 ;
		} else {
			return false;
		}
	}),

	//TODO: find a better way to do this
	url: computed('id', "participationPack", function () {
		const loc = window.location;
		const url = loc.protocol + '//' + loc.host + "/" + this.get("community.url")+ "/" +this.get("participationPack").get("project.url")+ "/proposition/" +this.get("participationPack.id") +'/' +this.get("participationPack.url")+'/'+this.get('id');
		return url;
	}),

	//Check if the proposition has reached the upvotes needed to open a discussion
	upvotesReached: computed('globalRelevancy', "participationPack", function () {
		const upvotesNeeded = this.get("participationPack.ideaBox.upvotesNeeded");
		if (this.get("globalRelevancy") < upvotesNeeded) {
			return false;
		} else {
			return true;
		}
	}),

});
