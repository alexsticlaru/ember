import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TitlePanel extends Component {
	@tracked showText = false;

	// catch to ensure video autoplays
	@action
	initVideo() {
		const videoElem = document.querySelector('.homepage-title-panel__video');
		if (videoElem.paused) {
			videoElem.muted = true;
			videoElem.play();
		}

		this.showText = true;
	}
}
