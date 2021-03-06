import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  classNames: ['homepage-testimonial-blocks'],
	classNameBindings: ['visibilityClass'],

	visibilityClass: '',

	didEnterViewport: function () {
		this.set('visibilityClass', 'visible');
	}
});
