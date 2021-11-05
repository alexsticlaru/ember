import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class ProjectUpdateAddFormComponent extends Component {
  @service store;
  @service cloudinary;
  @service toast;

  @tracked newUpdateContent;
  @tracked newUpdateTitle;
  @tracked newUpdateImage;
  @tracked newUpdateDate;
  @tracked newUpdateScheduled;

  @action addUpdate() {
    if (this.newUpdateContent && this.newUpdateTitle) {
      this.newUpdate = this.store.createRecord('project-update', {
        title: this.newUpdateTitle,
        content: this.newUpdateContent,
        image: this.newUpdateImage,
        date: new Date(),
        status: "active",
        project: this.args.project,
      });

      this.newUpdate.save().then((update) => {
        //add to model
        this.toast.success("Saved");
        this.args.project.projectUpdates.insertAt(0, update);
        this.args.onUpdateAdded();
			});
    }
  }

  @action	uploadPicture() {
    const filePicker = document.getElementById("update-image-upload");
    this.cloudinary.uploadImage("users", filePicker.files[0]).then((response) => {
      this.newUpdateImage = response;
    });
  }

	get scheduledDateArray() {
		return [this.newUpdateDate];
	}

	@action scheduledDateChanged(newDate) {
		if (newDate) {
			this.newUpdateDate = newDate[0];
		}
	}
}
