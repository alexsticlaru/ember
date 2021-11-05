import { notEmpty } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';

/**
 * This is the EVENTS service.
 *
 * It centralises state info concerning the
 * online events running on the platform.
 */
export default Service.extend({
	store: service(),

	runningEvents: A(),
	hasRunningEvents: notEmpty('runningEvents'),
	promotedEvent: computed('runningEvents', function () {
								return this.get('runningEvents').objectAt(0) ;
							}),

	init: function () {
		this._super() ;

		const _this = this;
		const store = this.get('store') ;

		store.findAll('event')
			.then( function (events) {
				_this.set('runningEvents', events.filterBy('running', true)) ;
			}) ;
	}
}) ;

