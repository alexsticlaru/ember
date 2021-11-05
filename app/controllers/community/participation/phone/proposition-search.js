import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {later, cancel} from "@ember/runloop";

export default class PropositionSearchController extends Controller {
    @service sidePanel;
    @tracked searchText;
    @tracked showCancelBtn = false;

    @tracked page = 1;
	@tracked perPage = 10;

    @action
    closeSearchPanel() {
        this.sidePanel.hideSidePanel();
    }

    @action
    clearSearchText(){
        this.searchText = '';
    }

    @action
	searchPropositions(searchText) {
		if (this.searchTimer) {
			cancel(this.searchTimer);
		}
		if (this.searchText.length != 0 && this.searchText.length < 3) {
			return;
		}
		this.searchTimer = later(this, function () {
			this.send('updateSearch', searchText);
		}, 1000);
	}

    @action
    handleInputFocus() {
        this.showCancelBtn = true;
    }

    @action
    handleCancel() {
        this.showCancelBtn = false;
        this.searchText = '';
    }
}
