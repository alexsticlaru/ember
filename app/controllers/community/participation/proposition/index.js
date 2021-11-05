import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, oneWay } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import { inject as service } from '@ember/service';

export default class PropositionController extends Controller {
	queryParams = ['proposition', 'page'];
	proposition = null;

	@service popup;
	@service user;
	@service sidePanel;

	@tracked sortedAndFilteredPropositions = this.model.propositions;
	@tracked mapView = false;
	@tracked showAnswered = false;

	@tracked page = 1;
	@tracked perPage = 10;

	filters = {
		sort: "date"
	};

	get breadCrumbs() {
        return [
            {
                label: this.model.community.name,
                routeName: 'community',
                models: [ this.model.community.url],
                linkable: true
            },
            {
                label: this.model.project.name,
                routeName: 'community.participation',
                models: [this.model.community.url, this.model.project.url],
                linkable: true
            }
        ]
    }

	@action
	sortPropositions(sortType) {
		this.page = 1;

		delete this.filters.sort;
		if (sortType) {
			this.filters.sort = sortType;
		}
		this.handleFiltersChange(this.filters);
	}

	/*
	@action
	applyFilters(sortType, themesToFilter, relevancyByMe, relevancyByOrganisation, searchText) {
		this.sortedAndFilteredPropositions = this.model.propositions;
		this.page = 1;
		this.sortedAndFilteredPropositions = this.searchPropositions(searchText);
		if (themesToFilter.length) {
			this.sortedAndFilteredPropositions = this.filterPropositionsByTheme(themesToFilter);
		}

		this.sortedAndFilteredPropositions = this.filterRelevancyByMe(relevancyByMe);
		this.sortedAndFilteredPropositions = this.relevancyByOrganisation(relevancyByOrganisation);
		this.sortedAndFilteredPropositions = this.sortedAndFilteredPropositions.sortBy(sortType).reverse();
	}
	 */

	@action
	applyFilters(sortType, themesToFilter, relevancyFilter, searchText) {
		delete this.filters.theme;
		if (themesToFilter) {
			this.filters.theme = themesToFilter;
		}

		delete this.filters.searchText;
		if (searchText) {
			this.filters.searchText = searchText;
		}

		delete this.filters.relevancy;
		if (relevancyFilter) {
			this.filters.relevancy = relevancyFilter;
		}
		this.handleFiltersChange(this.filters);
	}

	@action
	sortContributions(sortType) {
		this.page = 1;

		delete this.filters.sort;
		if (sortType) {
			this.filters.sort = sortType;
		}
		this.handleFiltersChange(this.filters);
	}

	filterPropositionsByTheme(themesToFilter) {
		let filteredItems = [];
		themesToFilter.forEach((themeID) => {
			this.sortedAndFilteredPropositions.forEach(proposition => {
				proposition.themes.forEach(theme => {
					if (theme.id == themeID) {
						filteredItems.push(proposition);
					}
				});
			});
		});

		return filteredItems;
	}

	@action
	showMapView() {
		this.send('routeSetMapMode', true);
		this.mapView = true;
		this.page = 1;
	}

	@action
	closeMapView() {
		this.send('routeSetMapMode', false);
		this.mapView = false;
		this.removeAllHighlights();
		this.page = 1;
	}

	//this is the function from the proposition item to show it on the map
	@action showOnMap (proposition) {
		this.model.ideaBox.latitude = proposition.latitude;
		this.model.ideaBox.longitude = proposition.longitude;
		this.model.ideaBox.zoomLevel = 13;

		//put this proposition to front so it is easily visible
		// this.sortedAndFilteredPropositions.splice(this.sortedAndFilteredPropositions.indexOf(proposition), 1);
		// this.sortedAndFilteredPropositions.unshift(proposition);
		this.showMapView();
		this.highlightProposition(proposition);
	}

	@action
	showOnMapPanel(proposition) {
		this.model.ideaBox.latitude = proposition.latitude;
		this.model.ideaBox.longitude = proposition.longitude;
		this.model.ideaBox.zoomLevel = 13;
		this.openMapPanel();
	}

	@action highlightProposition(proposition) {
		// remove previous highlighted styles if exists
		this.removeAllHighlights();
		// then add highlighted style to the specific proposition
		proposition.highlightProposition = true;
	}

	removeAllHighlights() {
		this.model.propositions.forEach(propositionItem => {
			propositionItem.highlightProposition = false;
		});
	}

	@action
	openPropositionAddPage() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}

		this.model.isSidePanel = true;
		this.sidePanel.showSidePanel('community.participation.phone.proposition-add', this.model, 'community.participation.proposition-add')
	}

	@action
	closeSidePanel() {
		this.sidePanel.hideSidePanel();
	}

	@action
	closeMapPanel() {
		//just sorting by date for now
		this.closeMapView();
		this.sidePanel.hideSidePanel();
	}

	@action
	openFilterPanel() {
		// this.model.applyFilters = (sortType, themesToFilter, relevancyFilter) => {
		// 	this.applyFilters(sortType, themesToFilter, relevancyFilter, '');
		// 	this.sidePanel.hideSidePanel();
		// };
		this.sidePanel.showSidePanel('community.participation.phone.proposition-filter', this.model, 'community.participation.phone.proposition-filter');
	}

	@action
	openSearchPanel() {
		this.sidePanel.showSidePanel('community.participation.phone.proposition-search', this.model, 'community.participation.phone.proposition-search');
	}

	@action
	openMapPanel() {
		this.sortedAndFilteredPropositions = this.sortedAndFilteredPropositions.filter((proposition) => proposition.latitude && proposition.longitude);
		this.sidePanel.showSidePanel('community.participation.phone.proposition-map', this.model, 'community.participation.proposition.index');
	}

	@action
	handleFiltersChange(filters) {
		// notify the route to get new content for updated filters
		this.send('setFilters', filters);
	}
}
