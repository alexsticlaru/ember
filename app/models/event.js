import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';

const {
	attr,
	belongsTo,
	Model
} = DS ;

/**
 * This is the EVENT model.
 * It represents an online event organised by
 * a community.
 */
export default Model.extend({

	intl: service(),

	title: attr('string'),
	description: attr('string'),
	dateBegin: attr('date'),
	dateEnd: attr('date'),
	location: attr('string'),
	image: attr('string'),
	registrationURL: attr('string'),
	status: attr('string'),
	community: belongsTo('community'),
	locale: attr('string'),

	period: computed('dateBegin', 'dateEnd', function () {
		const dateBegin = new Date(this.get('dateBegin'));
		const dateEnd = new Date(this.get('dateEnd'));
		moment().locale(this.get('intl.locale'));

		if (dateEnd && !isNaN(dateEnd) && !moment(dateBegin).isSame(dateEnd)) {
			if (dateEnd.getDate() === dateBegin.getDate() && dateEnd.getMonth() === dateBegin.getMonth() && dateEnd.getYear() === dateBegin.getYear()) {
				return moment(dateBegin).format('LT') + ' - ' + moment(dateEnd).format('LT')
			} else {
				return moment(dateBegin).format('LLL') + ' - ' + moment(dateEnd).format('LLL')
			}
		} else {
			return moment(dateBegin).format('LT')
		}
	}),

	dayTimestamp: computed('dateBegin', function () {
		const dateBegin = new Date(this.get('dateBegin'));
		return Date.UTC(
			dateBegin.getFullYear(),
			dateBegin.getMonth(),
			dateBegin.getDate(),
			0, 0, 0, 0);
	}),

	dateStandardized: computed('dateBegin', function () {
		const dateBegin = this.get('dateBegin');
		return moment(dateBegin).format('YYYY-M-D');
	}),

	day: computed('dateBegin', function () {
		const dateBegin = new Date(this.get('dateBegin'));
		return dateBegin.getDate().toString();
	}),

	year: computed('dateBegin', function () {
		const dateBegin = new Date(this.get('dateBegin'));
		return dateBegin.getFullYear().toString();
	}),

	month: computed('dateBegin', function () {
		const dateBegin = new Date(this.get('dateBegin'));
		return dateBegin.getMonth().toString();
	}),

	monthString: computed('dateBegin', function () {
		const dateBegin = this.get('dateBegin');
		const locale = this.get('intl.locale');
		return moment(dateBegin).locale(locale).format('MMMM');
	}),

	// OLD ATTRIBUTE (MAYBE REWORK)
	running: computed('dateBegin', 'dateEnd', function () {
		const begin = moment(this.get('dateBegin'));
		const end = moment(this.get('dateEnd'));
		const now = moment() ;

		return now.isBetween(begin, end) ;
	}),
});
