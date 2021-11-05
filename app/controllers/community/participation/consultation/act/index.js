import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

//Explanation:
//this is a work in progress, especially for the filters I need data that are not developed in the BE yet
//for now I'm just using the proposition filters

export default class ActController extends Controller {
	queryParams = ['page'];

	@tracked page = 1;
	@tracked perPage = 10;
	@tracked activeTab = "discussion";
	@tracked ideasContainer = false;

	@service user;
	@service sidePanel;

	@tracked sortedAndFilteredContributions = this.model.comments;
	@tracked showAnswered = false;

	filters = {
		sort: "date"
	};

	get longBannerTitle(){
		if( this.model.participationPack.title.length > 92 )
			return true;
		else return false;
	}

	get breadCrumbs() {
		return [
			{
				label: this.model.project.community.content.name,
				routeName: 'community',
				models: [ this.model.project.community.content.url],
				linkable: true
			},
			{
				label: this.model.project.name,
				routeName: 'community.participation',
				models: [this.model.project.community.content.url, this.model.project.url],
				linkable: true
			}
		]
	}

	get bestAssertions () {
		return this.model.assertions.slice(0, 3);
	}

	searchContributions(searchText) {
		return this.sortedAndFilteredContributions.filter((contribution) => {
			if (contribution.content.includes(searchText)) {
				return contribution;
			} else if (contribution.title) {
				if (contribution.title.includes(searchText)) {
					return contribution;
				}
			}
		});
	}

	filterContributionByTheme(themesToFilter) {
		let filteredItems = [];
		themesToFilter.forEach((themeID) => {
			this.sortedAndFilteredContributions.forEach(contribution => {
				contribution.themes.forEach(theme => {
					if (theme.id == themeID) {
						filteredItems.push(contribution);
					}
				});
			});
		});

		return filteredItems;
	}

	filterRelevancyByMe(relevancyByMe) {
		if (relevancyByMe) {
			return this.sortedAndFilteredContributions.filter((contribution) => {
				if (contribution.isUpvoted) {
					return contribution;
				}
			});
		} else {
			return this.sortedAndFilteredContributions;
		}
	}

	@action
	openIdeasContainer() {
		this.ideasContainer = !this.ideasContainer
	}


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

		this.handleFiltersChange(this.filters);

		/*
		if (searchText) {
			this.sortedAndFilteredContributions = this.searchContributions(searchText);
		}
		if (themesToFilter.length) {
			this.sortedAndFilteredContributions = this.filterContributionByTheme(themesToFilter);
		}

		this.sortedAndFilteredContributions = this.filterRelevancyByMe(relevancyByMe);
		// relevancy by Organisation does not exist in the same way!
		// this.sortedAndFilteredContributions = this.relevancyByOrganisation(relevancyByOrganisation);
		this.sortedAndFilteredContributions = this.sortedAndFilteredContributions.sortBy(sortType).reverse();
		 */
	}

	@action
	openFilterPanel() {
		this.model.issue.applyFilters = (sortType, themesToFilter, relevancyByMe, relevancyByOrganisation) => {
		this.applyFilters(sortType, themesToFilter, relevancyByMe, relevancyByOrganisation, '');
		this.sidePanel.hideSidePanel();
		};
			//for now I'm just using the proposition filter
			//in the future we have to do all the filters -> implement with desktop logic
			this.sidePanel.showSidePanel('community.participation.phone.proposition-filter', this.model.issue, 'community.participation.phone.proposition-filter');
	}

	@action
	openSearchPanel() {
		this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-search', this.model, 'community.participation.consultation.act.phone.contribution-search');
	}

	@action
	openMorePanel() {
			this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-more', this.model, 'community.participation.consultation.act.phone.contribution-more');
	}

	@action
	openAboutSection() {
		this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-about', this.model.issue, 'community.participation.consultation.act.phone.contribution-about');
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

	@action
	changeTab(tab) {
		this.activeTab = tab;
	}

	@action
	nextPage() {
		this.page++;
	}

	@action
	handleFiltersChange(filters) {
		// notify the route to get new comments for updated filters
		this.send('setFilters', filters);
	}

	@action
	refeshCommentsList() {
		this.model.comments.setOtherParam('nameOrValueOfThisPropertyDoesNotReallyMatter', true);
	}

}
