import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data';

import FormatDate from '../utils/format-date';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend( {

	intl: 		service(),


	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attributes

	addedBy: attr(),
	count: attr('number'),
	dateVisit: attr('date'),
	status: attr('string'),
	stats: attr(),
	commented: attr('boolean', {
		defaultValue() {
			return true;
		}
	}),

	// Relationships

	issue: belongsTo('issue'),
	user: belongsTo('user'),

	// Attributes with computed properties

	translated: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	locale: attr('string'),
	localeOriginal: attr('string'),
	title: attr('string'),
	titleOriginal: attr('string'),
	summary: attr('string', {
		defaultValue() {
			return '';
		}
	}),
	summaryOriginal: attr('string'),
	shortSummary: computed('summary', function () {
		let summary = this.get('summary') ;
		return ( summary.length > 300 ) ?
					( summary.substr(0, 300) + '...' ) :
					summary ;
	}),

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),

	userName: computed(function () {
		return this.get('user').then(function (user) {
			const pre = user.get('firstName');
			const las = user.get('lastName');
			return(pre + " " + las);
		})
	}),

	lastConnectionToString: computed('stats', 'intl.locale', function () {
		if (this.get('stats').lastLogin.date[0] != "-")
			return FormatDate(this.get('stats').lastLogin.date, this.get('intl.locale'));
		return ("- ")
	}),

	ratio: computed(function () {
		if (Math.round(this.get('stats').read.ratio != "-"))
			return (Math.round(this.get('stats').read.ratio * 100, 0) + "%");
		return ("- %");
	}),




	//Last Login

	lastLoginState: computed(function () {
		const lastLogin = this.get('stats').lastLogin;

		return (lastLogin != undefined ? lastLogin.state : "");
	}),

	ratioState: computed(function () {
		const read = this.get('stats').read;

		return (read != undefined ? read.state : "");
	}),

	commentState: computed(function () {
		const contributions = this.get('stats').contributions;

		return (contributions != undefined ? contributions.state : "");
	}),

	selected: attr('boolean')


});
