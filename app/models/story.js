import { computed } from '@ember/object';
import DS from 'ember-data';

const {
	Model,
	attr,
} = DS ;

export default Model.extend({
	title: attr('string'),
	summary: attr('string'),
	date:  attr('date'),
	status: attr('string'),
	image: attr('string'),
	locale: attr('string'),
	url: attr('string'),
	computedImage: computed('image', function () {
		if (
			this.get('image') &&
			this.get('image') != ""
		) {
			return this.get('image') ;
		}
		return "static/home" ;
	}),
}) ;

