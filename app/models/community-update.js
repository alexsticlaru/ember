import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data' ;

const {
	Model,
	attr,
	belongsTo,
} = DS ;

export default  class CommunityUpdate extends Model {
	@service intl;

	@belongsTo('community') community;
	@belongsTo('project') project;
	@attr('string') title;
	@attr('string') content;

	@attr('boolean', {defaultValue() { return false; } }) translated;
	@attr('string') locale;
	@attr('string') localeOriginal;
	@attr('string') titleOriginal;
	@attr('string') contentOriginal;

	@attr('string') status;
	get isDeleted() {
		return this.get('status') === "deleted" ;
	}

	@attr('date') date;

	@computed('date', 'intl.locale')
	get displayDate() {
		return moment( this.get('date') ).fromNow() ;
	}
}
