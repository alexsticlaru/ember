import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
// import DS from 'ember-data';
import truncate from 'civ/utils/string-truncate' ;

import Model, { attr, belongsTo, hasMany  } from '@ember-data/model';

/*
const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;
*/

export default Model.extend( {

	intl:    service(),
	session: service(),

	dbgS: service('debug'),

	// Model attributes
	badges: attr(),
	birthdate: attr('date'),
	description: attr('string'),
	email: attr('string'),
	emailConfirmed: attr('boolean'),
	facebookId: attr('string'),
	keycloakId: attr('string'),
	keycloakOnly: attr('boolean'),
	firstName: attr('string'),
	gender: attr('number'),
	googleId: attr('string'),
	lastName: attr('string'),
	linkedinId: attr('string'),
	locale: attr('string'),
	password: attr('string'),
	checkPassword: attr('string'),
	summary: attr('string'),
	themes: attr(),
	title: attr('string'),
	twitterAccount: attr('string'),
	username: attr('string'),
	acceptedDataPolicy: attr('boolean'),
	acceptedUpdatedTerms: attr('boolean'),
	anonymous: attr('boolean'),
	v7: attr('boolean'),

	// Content visibility
	status: attr('string'),
	// Differentiate users created on user-add-form
	createdAsAdmin: attr('boolean'),
	// Differentiate users created on stakeholding-add
	createdAsstakeholding: attr('boolean'),
	// Magic token, sent on password-reset
	// to have a seamless login experience
	authData: attr(),
	// Email preferences
	notifBadges: attr('number'),
	notifComment: attr('number'),
	notifResponse: attr('number'),
	notifIssue: attr('number'),
	notifPropositions: attr('number'),
	notifCivNewsletter: attr('number'),
	unseenNotificationsCount: attr('number', {
		defaultValue() {
			return 0;
		}
	}),
	// Added for FOE (Summer 2017)
	citizenship: attr('string'),
	affiliation: attr('string'),
	experienceYears: attr('number'),
	deployed: attr('boolean'),
	previousParticipations: attr(),
	// End FOE.

	// Relationships

	actions: hasMany('action'),
	comments: hasMany('comment'),
	community: belongsTo('community'),
	homeCommunity: belongsTo('community'),
	issuesCreated: hasMany('issue'),
	stakeholdings: hasMany('issue-stakeholding'),
	profiles: hasMany('profile'),
	propositions: hasMany('proposition'),

	isGlobalAdmin: attr('boolean'),
	isDeveloper: attr('boolean'),
	isWebmaster: attr('boolean'),
	isTranslatorDE: attr('boolean'),
	isTranslatorEN: attr('boolean'),
	isTranslatorES: attr('boolean'),
	isTranslatorFR: attr('boolean'),
	isTranslatorHR: attr('boolean'),
	isTranslatorNL: attr('boolean'),
// 	userRights: hasMany('user-right'),
// userRights: attr(),

	//@hasMany('user-right') userRights,
	userRights: hasMany('user-right'),
	userRightsDats: attr(),

	// Foreign attributes
	type:'user',
	//
	// Attributes with computed properties
	//

	cover: attr('string'),
	computedCover: computed('cover', function () {
		return isEmpty(this.get('cover')) ? 'localitys/1' : this.get('cover') ;
	}),

	dateRegister: attr('date'),
	displayDateRegister: computed('date', 'intl.locale', function () {
		return moment( this.get('dateRegister') ).fromNow() ;
	}),

	fullName: computed('firstName', 'lastName', function () {
		let firstName = $('<textarea />').html(this.get('firstName')).val() ;
		let lastName = $('<textarea />').html(this.get('lastName')).val() ;

		if ( firstName == null && lastName == null ) {
			return this.get('username') ;
		} else if ( firstName != null && lastName == null ) {
			return firstName ;
		} else if ( firstName == null && lastName != null ) {
			return lastName ;
		} else {
			return firstName + ' ' + lastName ;
		}
	}),

	image: attr('string'),
	computedImage: computed('image', 'facebookId', 'twitterAccount', 'googleId', function () {
		if ( this.get('image') && this.get('image') != "" ) {
			return this.get('image') ;
		}
		if ( this.get('facebookId') != null ) {
			return this.get('facebookId') ;
		}
		if ( this.get('twitterAccount') != null ) {
			return this.get('twitterAccount') ;
		}
		if ( this.get('googleId') != null ) {
			return this.get('googleId') ;
		}
		return 'static/default-user' ;
	}),
	imageType: computed('image', 'facebookId', 'twitterAccount', 'googleId', function () {
		if ( this.get('image') && this.get('image') != "" ) {
			return 'upload' ;
		}
		if ( this.get('facebookId') != null ) {
			return 'facebook' ;
		}
		if ( this.get('twitterAccount') != null ) {
			return 'twitter_name' ;
		}
		if ( this.get('googleId') != null ) {
			return 'gplus' ;
		}
		return 'upload' ;
	}),

	//! Feb 2021: DEPRECATED V7 (use userService.isGlobalAdmin property/getter) - Still in use on V6
	roles: attr(),
	isGeneralAdmin: computed('roles', function() {
//  this.get('dbgS').notify( "User model isGeneralAdmin : roles=", this.get('roles')/*, " - Adm=", this.get('roles').indexOf('ROLE_ADMIN') */);
		if( !this.get('roles') )return false;
		if( typeof this.get('roles') === "object" ){
			let ret = false;
			Object.entries(this.get('roles')).forEach(([i, v]) => {
				if( v==="ROLE_ADMIN" ){
					ret = true;
					return true;
				}
			});
			return ret;
		}else
			return this.get('roles').indexOf('ROLE_ADMIN') > -1 ;
	}),
	//

	truncatedName: computed('firstName', 'lastName', function () {
		return truncate.apply( this.get('fullName'), [25, true] ) ;
	}),

	subscribe: function (type, token) {
		if ( this.get('session.isAuthenticated') ) {
			this.set(type, 1) ;
			return this.save() ;
		} else {
			const adapter = this.store.adapterFor(this.constructor.modelName) ;
			let _this = this ;
			return adapter.subscribe(this, type, token).then( function () {
				_this.set(type, 1) ;
			}) ;
		}
	},

	unsubscribe: function (type, token) {
		if ( this.get('session.isAuthenticated') ) {
			this.set(type, 0) ;
			return this.save() ;
		} else {
			const adapter = this.store.adapterFor(this.constructor.modelName) ;
			let _this = this ;
			return adapter.unsubscribe(this, type, token).then( function () {
				_this.set(type, 0) ;
			}) ;
		}
	},

	selected: attr('boolean'),
	highlighted: attr('boolean')

});
