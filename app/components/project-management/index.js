import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class ProjectManagementComponent extends Component {
  @service store;
  @service cloudinary;
  @service toast;
  @service intl;

  @tracked project;
  @tracked processingImage=false;
  @tracked processingChanges=false;
  @tracked changesSaved=false;

  constructor() {
		super(...arguments);

    if (!this.args.project) {
      this.project = this.store.createRecord('project', {
        community: this.args.community,
        status: "active"
      });
    } else {
      this.project = this.args.project;
    }
	}

  @action saveProject() {
	this.processingChanges = true;
    this.project.save().then(() => {
      this.processingChanges = false;
      this.changesSaved = true;
      setTimeout(() => {
        this.changesSaved =false;
      }, 3000);

      this.toast.success(this.intl.t('pb.projects.savedChanges'))
    }).catch( e => {
		this.processingChanges = false;
		this.toast.error(this.intl.t('pb.projects.savedChangesFailure'))
		const _e = e;
		later( function(){throw _e;}, 2000 );
	});
    if (this.args.onSave) {
      this.args.onSave();
    }
  }

  @action	uploadImage() {
    this.processingImage = true;
    const filePicker = document.getElementById("image-upload");
    this.cloudinary.uploadImage("communities", filePicker.files[0]).then((response) => {
      this.project.image = response;
      this.processingImage = false;
    });
  }

}
