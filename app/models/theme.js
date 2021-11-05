import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

/**
 * This is the PROPOSITION-THEME model.
 * @class {Model} Community
 */
export default Model.extend({

	//cloudinary: inject.service(),
	//toast: inject.service(),
	intl: service(),

	// Model attrs
	//name: attr('string'),
	//label: attr('string'),
	//id: attr('number'),
	routeLabel: attr('string'),
	labelDe: attr('string'),
	labelEs: attr('string'),
	labelEn: attr('string'),
	labelFr: attr('string'),
	labelNl: attr('string'),
	status: attr('string'),
	updated: attr('date', {
		deserialize: true
	}),
	localisedLabel: attr('string'),/*DEPRECATED! Use labelTranslate*/
	isSelected: attr('boolean'),

	community: DS.hasMany('community'),
	proposition: DS.hasMany('proposition'),
	issue: DS.hasMany('issue'),
	comment: DS.hasMany('comment'),

	labelTranslate: computed('intl.locale', function () {
		const intl = this.get('intl');
		const locale = intl.locale;
		return this.get(`label${locale.firstObject.charAt(0).toUpperCase() + locale.firstObject.slice(1)}`);
	}),

}) ;
