import DS from 'ember-data';
import { computed } from '@ember/object';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

/**
 * This model represents a project "document"
 *
 * It contains whatever the customer wants (basically,
 * HTML from the rich-editor or a document link).
 *
 * @class Section
 * @extends DS.Model
 */
export default Model.extend({

	title: attr('string'),
	url: attr('string'),
	content: attr('string'),
	date: attr('date'),
	status: attr('string'),
	priority: attr('number'),
	linksEnabled: attr('boolean'),
	bottomUpLevel: attr('string'),

	community: belongsTo('community'),
	issue: belongsTo('issue'),
	project: belongsTo('project', { inverse: null }),
	displayDate: computed('date', function () {
		const day =  moment(this.get('date'), 'DD-MM-YYYY').format('Do');
		const month = this.get('date').toLocaleString('default', { month: 'short' })
		return `${day} ${month} ${this.get('date').getFullYear()}`
	}),
}) ;
