import Component from '@glimmer/component';
import {action} from "@ember/object";
import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';
import {later, cancel} from "@ember/runloop";

export default class ProjectMembers extends Component {
	@service store;

	@tracked isLoading = false;
	@tracked showAllMembers = false;
	@tracked filteredMembers = [];
	@tracked searchText = '';

	allMembers = [];
	searchTimer = null;

	@action loadMoreMembers() {
		this.isLoading = true;
		return this.store.query('project-following', {
			"filters[project]": this.args.project.id,
			"filters[status]": "active",
			"order_by[date]": "DESC"
		}).then((members) => {
			this.allMembers = members;
			this.filteredMembers = members;
			this.showAllMembers = true;
			this.isLoading = false;
		});
	}

	@action removeMember(projectFollowing) {
		projectFollowing.destroyRecord().then(() => {
			if (this.args.project.globalRelevancy>0) {
				this.args.project.globalRelevancy--;
			}
		});
	}

	@action
	async searchMembers() {
		// make sure the full list is loaded
		if (!this.showAllMembers) {
			await this.loadMoreMembers();
		}

		// if searchText is empty, display all members
		if (this.searchText.length==0) {
			this.filteredMembers = this.allMembers;
			return;
		}

		// do the search
		const searchText = this.searchText.toLowerCase();
		this.filteredMembers = this.allMembers.filter((projectFollowing) => {
			if (projectFollowing.user.get('fullName').toLowerCase().includes(searchText)) {
				return projectFollowing;
			}
		});
	}

	@action
	searchMembersKey() {
		if (this.searchTimer) {
			cancel(this.searchTimer);
		}
		if (this.searchText.length > 0 && this.searchText.length < 3) {
			return;
		}
		this.searchTimer = later(this, function () {
			this.searchMembers();
		}, 1000);
	}
}
