import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class PropositionFilterController extends Controller {
    @tracked sortType = 'date';
    @tracked themesToFilter = [];
    @tracked relevancySupported = false;
    @tracked searchText;
  
	@tracked relevancyMap = false;
	@tracked relevancyAnswered = false;
    @service sidePanel;

    @action
    closeFilterPanel() {
        this.sidePanel.hideSidePanel();
    }

    @action
    setSortType(key) {
		this.sortType = key;
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
    applyAllFilters() {
		let relevancyFilter = [];
		if (this.relevancyAnswered) {
			relevancyFilter.push('answered');
		}
    
		if (this.relevancySupported) {
			relevancyFilter.push('supported');
		}
		if (this.relevancyMap) {
			relevancyFilter.push('map');
		}
		this.send('updateFilters', this.sortType, this.themesToFilter, relevancyFilter, this.searchText);
		this.sidePanel.hideSidePanel();
    }


    @action
    clearFilters() {
        this.sortType = 'date';
        this.themesToFilter = [];
        this.relevancySupported = false;
        this.relevancyMap = false;
        this.relevancyAnswered = false;
    }
}
