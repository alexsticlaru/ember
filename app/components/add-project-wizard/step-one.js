import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AddProjectWizardStepOneComponent extends Component {
  @service store;
  @service cloudinary;
  @service toast;
  @service intl;
  @tracked processingImage=false;

  @action	uploadImage() {
    this.processingImage = true;
    const filePicker = document.getElementById("image-upload");
    this.cloudinary.uploadImage("communities", filePicker.files[0]).then((response) => {
      this.args.project.image = response;
      this.processingImage = false;
    });
  }

}
