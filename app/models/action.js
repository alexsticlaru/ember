import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend( {

	intl: service(),

	init: function () {
		this._super(...arguments) ;
		this.get('intl') ;
	},

	issue: belongsTo('issue'),
	user: belongsTo('user'),

	locale: attr('string'),
	localeOriginal: attr('string'),
	title: attr('string'),
	summary: attr('string'),
	translated: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	titleOriginal: attr('string'),
	summaryOriginal: attr('string'),

	url: attr('string'),
	date: attr('date'),

	count: attr('number'),

	community: belongsTo('community'),
	// Foreign attributes
	type:'action',

	image: attr('string'),
	computedImage: computed('image', function () {
		if (this.get('image') && this.get('image') != "") {
			return this.get('image');
		}
		return "not-found_qifo3a";
	}),

	/**
	 * Extracts the domain name from the link's URL.
	 */
	domain: computed('url', function () {
		let domain;
		let url = this.get('url');

		//find & remove protocol (http, ftp, etc.) and get domain
		if (url.indexOf("://") > -1)
			domain = url.split('/')[2];
		else
			domain = url.split('/')[0];
		//find & remove port number
		domain = domain.split(':')[0];

		return domain;
	}),

	type: attr('string'),

	typeLocale: computed('type', 'intl.locale', function () {
		let translation = this.get('intl').t('issue.action.type.' + this.get('type'));
		if(translation.indexOf && (translation.indexOf("Missing translation") > -1)){
			translation = this.get('intl').t('issue.action.act');
		}
		return translation;
	}),

	iconType: computed('type', function () {
		let icon ;
		switch ( this.get('type') ) {
			case "petition":
				icon = "glyphicon-pencil";
				break;
			case "event":
				icon = "glyphicon-camera";
				break;
			case "donation":
				icon = "glyphicon-euro";
				break;
			case "crowdfunding":
				icon = "glyphicon-euro";
				break;
			case "meetup":
				icon = "glyphicon-user";
				break;
			case "volunteer":
				icon = "glyphicon-user";
				break;
			case "thunderclap":
				icon = "glyphicon-user";
				break;
			case "investigation":
				icon = "glyphicon-search";
				break;
			default:
				icon = "glyphicon-user";
		}
		return icon ;
	}),

	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow() ;
	}),

	status: attr('string')
}) ;

