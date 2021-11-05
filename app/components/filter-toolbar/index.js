import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import {later, cancel} from "@ember/runloop";
import { inject as service } from '@ember/service';

export default class FilterToolbar extends Component {
	//this component will in the future also substitute the propositions/toolbar component
	@service intl;
	@service share;

	@tracked isExpanded = false;

    @tracked sortType = 'date';
    @tracked themesToFilter = [];
    @tracked themesOpen = false;
    @tracked sortOpen = false;
    @tracked sortRelevancyOpen = false;
	@tracked relevancyFilter;
    @tracked relevancyAnswered = false;
    @tracked relevancySupported = false;
	@tracked relevancyMap = false;
    @tracked searchText = '';
    @tracked activeFilterThemes = false;
    @tracked activeSort = false;
    @tracked activeSortType = null;
    @tracked activeRelevancy = false;

    searchTimer = null;

    @action
    expandFilters() {
		this.isExpanded = true;
    }

    @action
    setSortType(key) {
		this.sortType = key;
    }

    @action
    sortItems() {
		this.isExpanded = true;
        this.activeSort = true;
        this.activeSortType = this.sortType;
        this.args.onSortItems(this.sortType);
    }

    @action
    applyThemesFilters() {
        this.activeFilterThemes = true;
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyFilter, this.searchText);
    }

    @action
    handleThemeFiltering(themeId) {
		if (this.themesToFilter.includes(themeId)) {
			const themeIndex = this.themesToFilter.indexOf(themeId);
			this.themesToFilter.splice(themeIndex, 1);
		} else {
			this.themesToFilter.push(themeId);
		}
    }

    @action
    clearThemesSelection() {
        this.activeFilterThemes = false;
        this.themesToFilter.clear();
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyFilter, this.searchText);
    }

    @action
    deactivateThemes() {
        this.themesOpen = false;
    }

    @action
    activateThemes() {
        this.themesOpen = true;
    }

    @action
    activateSort() {
        this.sortOpen = true;
    }

    @action
    deactivateSort() {
        this.sortOpen = false;
    }

    @action
    activateSortRelevancy() {
        this.sortRelevancyOpen = true;
    }

    @action
    deactivateSortRelevancy() {
        this.sortRelevancyOpen = false;
    }

    @action
    handleFilteringRelevancy() {
        this.activeRelevancy = this.relevancyAnswered || this.relevancySupported || this.relevancyMap;
        let filter = [];
		if (this.relevancyAnswered) {
			filter.push('answered');
		}
		if (this.relevancySupported) {
			filter.push('supported');
		}
		if (this.relevancyMap) {
			filter.push('map');
		}
		this.relevancyFilter = filter;
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyFilter, this.searchText);
    }

    @action
    searchPropositions() {
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyFilter, this.searchText);
    }

	@action
	searchPropositionsKey() {
		if (this.searchTimer) {
			cancel(this.searchTimer);
		}
		if (this.searchText.length != 0 && this.searchText.length < 3) {
			return;
		}
		this.searchTimer = later(this, function () {
			this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyFilter, this.searchText);
		}, 1000);
	}

    @action
    toggleMapView() {
        if (!this.args.mapView) {
            this.args.onShowMapView();
        } else {
            this.args.onCloseMapView(this.sortType);
        }
    }

    @action
    shareConsultation() {
      const shareModel = {
        url: window.location.href,
        popupTitle: this.intl.t('ideaBox.shareButton.actShare'),
        shareMessage: this.intl.t('ideaBox.shareButton.messageAct')
      };

      this.share.showPopup(shareModel);
    }
}
