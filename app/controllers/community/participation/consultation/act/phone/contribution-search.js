import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { alias, oneWay } from '@ember/object/computed';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default class ContributionSearchController extends Controller {
    @service sidePanel;
    @tracked searchText;
    @tracked showCancelBtn = false;
    @tracked contributions = this.model.issue.comments;

    @tracked page = 1;
	@tracked perPage = 10;
    @pagedArray(
		'contributions',
		{ page: alias('parent.page'), perPage: alias('parent.perPage') }
	) pagedContributions;
	@oneWay('pagedContributions.totalPages') totalPages;

    @action
    closeSearchPanel() {
        this.sidePanel.hideSidePanel();
    }

    @action
    clearSearchText(){
        this.searchText = '';
    }

    @action
    searchContributions(searchText) {
        this.contributions = this.model.issue.comments.sortBy('date').reverse()
		.filter((contribution) => {
			if (contribution.content.includes(searchText)) {
				return contribution;
			} else if (contribution.title) {
				if (contribution.title.includes(searchText)) {
					return contribution;
				}
			}
		});
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
