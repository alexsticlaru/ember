import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default class CookieConsentComponent extends Component {
  @service('user') userService;
  @service('popup') popupService;
  @service('cookies') cookiesService;
  @tracked hideComponent = false;
  @tracked isExpanded = false;

  get showIt(){
	  if( this.popupService._forceCookieConsentOpening ){
		// this is a handle to force reopening the (popup-like) cookie consent settings by calling popupService.forceCookieConsentOpening();
		this.isExpanded = true;
		return true;
	}
	return !(this.hasAgreedToCookies || this.hideComponent);
  }

  closePanel(){
    this.hideComponent = true;
	this.popupService._forceCookieConsentOpening = false;
	this.isExpanded = false;
  }

  get hasAgreedToCookies() {
    if (document.cookie.includes("cookieConsent=true")) {
      return true;
    }
    return false;
  }

  @action agreeAll() {
    const cookieDate = new Date;
    cookieDate.setFullYear(cookieDate.getFullYear() +1);
	this.cookiesService.write('cookieConsent', true, {path:'/', expires:cookieDate});
	this.cookiesService.write('cookieConsentVideo', true, {path:'/', expires:cookieDate});
	this.cookiesService.write('cookieConsentStatistics', true, {path:'/', expires:cookieDate});
	//this.cookiesService.write('cookieConsentZendesk', true, {path:'/', expires:cookieDate});
	this.closePanel();
  }

  @action agreeNecessary() {
    const cookieDate = new Date;
    cookieDate.setFullYear(cookieDate.getFullYear() +1);
	this.cookiesService.write('cookieConsent', true, {path:'/', expires:cookieDate});
	this.cookiesService.write('cookieConsentVideo', false, {path:'/', expires:cookieDate});
	this.cookiesService.write('cookieConsentStatistics', false, {path:'/', expires:cookieDate});
	this.closePanel();
  }

  @action saveUserChoices() {
    const cookieDate = new Date;
    cookieDate.setFullYear(cookieDate.getFullYear() +1);
	this.cookiesService.write('cookieConsent', true, {path:'/', expires:cookieDate});
	this.closePanel();
  }

  @action expand() {
    this.isExpanded=true;
  }
}
