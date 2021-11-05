import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ProjectUpdateEditFormComponent extends Component {
	@service store;
	@service cloudinary;
	@service toast;
	@service intl;
	@tracked processingChanges=false;
  @tracked changesSaved=false;

	get scheduledDateArray() {
		return [this.args.update.scheduledDate];
	}

	@action scheduledDateChanged(newDate) {
		if (newDate) {
			newDate[0].setHours(14);
			this.args.update.scheduledDate = newDate[0];
		}
	}

	@action saveUpdate() {
		this.processingChanges = true;

		const oldProject = this.args.update.project;
		this.args.update.save().then(() => {
			this.processingChanges = false;
			this.changesSaved = true;
			$('html, body').animate({scrollTop: $(".community-management").offset().top - 100}, 1000);
			setTimeout(() => {
				this.changesSaved =false;
			}, 3000);
			this.toast.success(this.intl.t('pb.projects.savedChanges'))

			this.args.toggleEditForm();

			// workaround for a weird bug, otherwise this is somehow null
			this.args.update.project = oldProject;
		})
	}

	@action uploadPicture() {
		const filePicker = document.getElementById("update-image-upload");
		this.cloudinary.uploadImage("users", filePicker.files[0]).then((response) => {
			this.args.update.image = response;
		});
	}
}
