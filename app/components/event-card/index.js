import Component from '@glimmer/component';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class EventCard extends Component {
	@service popup;

	@action openPopup() {
		this.popup.showPopup("event-popup");
	}
}
