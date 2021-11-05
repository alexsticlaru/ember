import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class PropositionsToolbar extends Component {

    @tracked sortType = 'date';
    @tracked themesToFilter = [];
    @tracked themesOpen = false;
    @tracked sortOpen = false;
    @tracked sortRelevancyOpen = false;
    @tracked relevancyByMe = false;
    @tracked relevancyByOrganisation = false;
    @tracked mapView = false;
    @tracked searchText = '';
    @tracked activeFilterThemes = false;
    @tracked activeSort = false;
    @tracked activeRelavancy = false;

    @action
    setSortType(key) {
		this.sortType = key;
    }

    @action
    sortPropositions() {
alert("OK sortPropositions!");
        this.activeSort = true;
console.log("this.args.onSortPropositions:", this.args.onSortPropositions);
        this.args.onSortPropositions(this.sortType);
    }

    @action
    applyThemesFilters() {
        this.activeFilterThemes = true;
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyByMe, this.relevancyByOrganisation, this.searchText);
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
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyByMe, this.relevancyByOrganisation, this.searchText);
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
        this.activeRelavancy = this.relevancyByMe || this.relevancyByOrganisation;
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyByMe, this.relevancyByOrganisation, this.searchText);
    }

    @action
    searchPropositions() {
        this.args.onApplyFilters(this.sortType, this.themesToFilter, this.relevancyByMe, this.relevancyByOrganisation, this.searchText);
    }

    @action
    toggleMapView() {
        this.mapView = !this.mapView;
        if (this.mapView) {
            this.args.onShowMapView();
        } else {
            this.args.onCloseMapView(this.sortType);
        }
    }

}
