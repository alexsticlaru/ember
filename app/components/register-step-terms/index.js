import Component from '@ember/component';
import { run } from '@ember/runloop';

export default Component.extend({
	classNames: ['register-step-terms'],

	didInsertElement: function () {
		run.scheduleOnce('afterRender', function () {
			$('#modal-popup .modal-dialog, #login-popup')
				.addClass('wide') ;
		}) ;
	},

	willDestroyElement: function () {
		run.scheduleOnce('afterRender', function () {
			$('#modal-popup .modal-dialog, #login-popup')
				.removeClass('wide') ;
		}) ;
	},
}) ;
