import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from '../../config/environment' ;
import { inject as service } from '@ember/service';

export default class SocialShareComponent extends Component {
  @service toast;
  @service intl;
  @tracked copiedLink = false;

  @action facebookShareURL() {
    const link = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.args.url) ;
    window.open(link);
  }

  @action facebookMessengerShareURL() {
	const link = "https://www.facebook.com/dialog/send?app_id=" + config.APP.API_KEYS.facebookAppId + "&link=" + encodeURIComponent(this.args.url) + "&redirect_uri=" + encodeURIComponent(this.args.url);
    window.open(link);
  }

  @action twitterShareURL() {
    const twitterUrl = "https://twitter.com/intent/tweet?text=" ;
    const link = twitterUrl + encodeURIComponent(this.args.message) + "&url=" + encodeURIComponent(this.args.url);
    window.open(link);
  }

  @action emailShareUrl() {
    const link = "mailto:?subject=" + this.args.message + "&body=" + encodeURIComponent(this.args.url);
    // window.open(link);
    location.href = link;
  }

  @action copyShareUrl() {
/* This is not working everywhere for (security reasons?) : navigator.clipboard is undefined in Firefox 78.11.0esr at least
    navigator.clipboard.writeText(this.args.url)
      .then(() => {
        this.copiedLink = true;
      });
*/
	var copyText = $('.social-share__copy-url-text')[0];//this needs to be a text field or area
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */
	document.execCommand("copy");
	this.toast.success(this.intl.t('ideaBox.shareButton.copiedLink'));//yeah, initialy for the idea box module : we'll need to change the path everywhere to socialShare.shareButton but we'll wait for new exported translations (it, ca, hr) to be imported before straightening any paths
	this.copiedLink = true;
  }

  @action whatsappShareURL() {
    const link = "https://api.whatsapp.com/send?text=" + encodeURIComponent(this.args.url);
    window.open(link);
  }

  //not needed for now but I still leave it here
  @action linkedInShareURL() {
    const message = this.args.message;
    const link = "https://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(this.args.url) + "&title=" + message;
    window.open(link);
  }

}
