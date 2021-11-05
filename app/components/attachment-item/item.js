import Component from '@glimmer/component';

export default class AttachmentItem extends Component {
	//if a user has not agreed to video cookies, they will not
	//see the iframe but instead a simple link attachment
	get userHasAgreedToVideoCookies() {
		return document.cookie.includes("cookieConsent=true");
	}
}
