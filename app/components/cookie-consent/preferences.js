import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default class CookieConsentPreferencesComponent extends Component {
  @service('cookies') cookiesService;
  //@Johann: for zendesk you can simply comment out the code here (and in the template +  index.js)
  //then you can use document.cookie.includes("cookieConsentZendesk=true"
  //to check wether a user has accepted the zendesk cookie

  @tracked statistics = true;
  @tracked video = false;
  //@tracked zendesk = false;

  constructor() {
    super(...arguments);
	if( this.cookiesService.read('cookieConsentStatistics') )
		this.statistics = (this.cookiesService.read('cookieConsentStatistics') == "true") ;

	if( this.cookiesService.read('cookieConsentVideo') )
		this.video = (this.cookiesService.read('cookieConsentVideo') == "true") ;

// 	if( this.cookiesService.read('cookieConsentZendesk') )
// 		this.zendesk = (this.cookiesService.read('cookieConsentZendesk') == "true") ;

  }

  @action setStatisticsPreference() {
    this.statistics = !this.statistics;
	const cookieDate = new Date;
	cookieDate.setFullYear(cookieDate.getFullYear() +1);
    if (this.statistics==true)
	  	this.cookiesService.write('cookieConsentStatistics', true, {path:'/', expires:cookieDate});
    else
	  	this.cookiesService.write('cookieConsentStatistics', false, {path:'/', expires:cookieDate});
  }

  @action setVideoPreference() {
    this.video = !this.video;
	const cookieDate = new Date;
	cookieDate.setFullYear(cookieDate.getFullYear() +1);
    if (this.video==true)
	  this.cookiesService.write('cookieConsentVideo', true, {path:'/', expires:cookieDate});
    else
// 		this.cookiesService.clear('cookieConsentVideo');
 		this.cookiesService.write('cookieConsentVideo', false, {path:'/', expires:cookieDate});
  }

  // @action setZendeskPreference() {
  //   this.zendesk = !this.zendesk;
  //   const cookieDate = new Date;
  //   cookieDate.setFullYear(cookieDate.getFullYear() +1);
  //   if (this.zendesk==true) {
  //     const cookieDate = new Date;
  //     cookieDate.setFullYear(cookieDate.getFullYear() +1);
// 	  this.cookiesService.write('cookieConsentZendesk', false, {path:'/', expires:cookieDate});
  //   } else {
// 		 this.cookiesService.clear('cookieConsentZendesk');
  //   }
  // }

}
