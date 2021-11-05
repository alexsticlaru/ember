import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { run, scheduleOnce } from '@ember/runloop';

/**
 * This service handles popup display.
 *
 * Update Oct 17 2019 : With the flat-popup new version we tried to simplify the popup handling.
 * Now the flat-popup is mainly handled through this service (usually we will name it as 'popupService' property in components and controllers). The render template to output the current template content is made in the application route that is passed to the service through popupService.setPopupRenderer(theRenderingRoute).
 *
 * @class PopupService
 * @extends Ember.Service
 */
export default class PopupService extends Service {
	@service('debug') dbgS;

	@tracked flatPopupMainClass = 'hide-popup';
	@tracked customContainerClass = '';
    _dbg_logAllCalls = true;
	popup_renderer = null;
	_popupCallback = null;

	/*A frontend to quickly enable/disable all methods calls login in the service*/
	_dbgHandler() {
		if(!this._dbg_logAllCalls)return;
		let args = arguments;
		args[0] = "service popup " + args[0];
		this.dbgS.notify(...args);
	}

	@tracked _forceCookieConsentOpening = false;
	forceCookieConsentOpening(){
		this._forceCookieConsentOpening = true;
	}
	/**
	 * Closes the popup modal
	 * @method close
	 * @return {Promise} a promise that resolves once the popup is invisible.
	 */
	close() {
		this._dbgHandler("close()");
		document.getElementsByTagName('body')[0].classList.remove('modal-open');
		document.getElementsByTagName('body')[0].classList.remove('flat_popup_shown');
		this.flatPopupMainClass = 'hide-popup';
		this.showPageContentForScreenreaders();
	}

	closeAndLaunchCallback(object){
		this._dbgHandler("closeAndLaunchCallback()");
		this.close();
		if (this._popupCallback) {
			this._popupCallback(object);
		}
	}

	setPopupRenderer(route){//should be the application route...
		this.popup_renderer = route;
	}

	showPopup(template, model, onCloseCallback, controllerName) {
		this._dbgHandler(`showPopup(${template})`);
		this._popupCallback = onCloseCallback;
		this.popup_renderer.flat_popup_render(template, model, controllerName);
		const templateSplit = template.split('.');
		this.flatPopupMainClass = templateSplit.length > 1 ? `show-popup ${templateSplit[templateSplit.length - 1]}` : `show-popup ${template}`;
		this.customContainerClass =templateSplit.length > 1 ? templateSplit[templateSplit.length - 1] : `${template}`;
		document.getElementsByTagName('body')[0].classList.add('modal-open');
		document.getElementsByTagName('body')[0].classList.add('flat_popup_shown');
		this.hidePageContentForScreenreaders();
	}


	hidePageContentForScreenreaders() {
		const afterRenderScreenreader = function() {
			// hide and remove content from screenreader
			if (document.getElementById("page-content-accessibility")) {
				document.getElementById("page-content-accessibility").setAttribute('aria-hidden', true);
				document.getElementById("page-content-accessibility").setAttribute('tab-index', -1);
			}
			// focus on the accessibility Hook after the render
			if (document.getElementById("accessibility-focus")) {
				document.getElementById("accessibility-focus").focus();
			}
		}
		run.scheduleOnce('afterRender', afterRenderScreenreader) ;
	}

	showPageContentForScreenreaders() {
		document.getElementById("page-content-accessibility").setAttribute('aria-hidden', false);
		document.getElementById("page-content-accessibility").setAttribute('tab-index', null);
	}


}
