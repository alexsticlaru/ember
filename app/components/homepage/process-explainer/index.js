import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

//TODO replace mixing
export default Component.extend(InViewportMixin, {
  classNames: ['homepage-process-explainer'],
	classNameBindings: ['playState'],


	playState: 'paused',
	//TODO replace this with container query in the template
	showMobileVersion: computed('device', 'device.isMobile', function() {
		return false;
	}),

	didEnterViewport: function () {
		this.set('playState', 'playing');
	}
});
