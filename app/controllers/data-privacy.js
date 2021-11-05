import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
	session:         service(),
	popupService: 	service('popup'),


	/**
	 * Cover image CSS.
	 * @property   coverCSS
	 */
	coverCSS: computed(function () {
		let css = "background-image: url('" ;
		css += this.get('cloudinary').getURL("v1466524768/static/privacy", {
			height: "270",
			width: "1366",
			transforms: "c_lfill,q_auto,f_auto",
			format: "jpeg"
		}) ;
		css += "');" ;
		return htmlSafe(css);
	})

});
