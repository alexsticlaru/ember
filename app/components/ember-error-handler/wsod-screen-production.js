import Component from './wsod-screen';
import layout from '../../templates/components/ember-error-handler/wsod-screen-production';

export default Component.extend({
    layout,
	descriptors: null,
	debugMessage: null,

	/*Additional message to add eventually :
	message: computed(function () {
		return this.get('descriptors.firstObject.normalizedMessage');
	}),
  */

    didInsertElement() {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
    }
});
