import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserAvatarUploadComponent extends Component {
  @service cloudinary;
	@service user;

  @tracked processingImage=false;

  @action	uploadPicture() {
    this.processingImage = true;
		const filePicker = document.getElementById("avatar-upload");
		this.cloudinary.uploadImage("users", filePicker.files[0]).then((response) => {
      const user = this.user.getCurrentUser();
      user.image = response;
			user.save().then(() => {
        this.processingImage = false;
      });
		});
	}
}
