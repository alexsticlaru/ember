import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class AnalyticsService extends Service {
  @service('community') communityService;

  trackPiwikPageView(url) {
    //did user accept cookies?
    if (document.cookie.includes("cookieConsentStatistics=true")) {
      let communityId;
      if (this.communityService.currentCommunity && !isEmpty(this.communityService.currentCommunity.get('id'))) {
        communityId = this.communityService.currentCommunity.get('id');
      }

      _paq.push(['setCustomUrl', url]);
      if (communityId) {
        _paq.push(['trackPageView', url, {dimension1: communityId}]);
      } else {
        _paq.push(['trackPageView']);
      }
    }
  }
}
