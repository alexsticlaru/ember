import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class CommunityManagementComponent extends Component {
  @service store;
  @service cloudinary;
  @service user;
  @service toast;
  @service intl;

  @tracked processingCover=false;
  @tracked processingLogo=false;

  @tracked processingChanges=false;
  @tracked changesSaved= false;


  @action saveCommunity() {
	this.processingChanges = true;
    this.args.community.save().then(() => {
      this.processingChanges = false;
      this.toast.success(this.intl.t('pb.projects.savedChanges'));
      this.changesSaved = true;
      setTimeout(() => {
        this.changesSaved =false;
      }, 3000);

    }).catch( e => {
		this.processingChanges = false;
		this.toast.error(this.intl.t('pb.projects.savedChangesFailure'))
		const _e = e;
		later( function(){throw _e;}, 2000 );
	});
  }

  @action changeLanguage(value) {
    this.args.community.locale = value;
  }

  @action changeCountry(value) {
    this.args.community.country = value;
  }

  @action changeType(value) {
    this.args.community.type = value;
  }

  @action	uploadCover() {
    this.processingCover = true;
    const filePicker = document.getElementById("cover-image-upload");
    this.cloudinary.uploadImage("communities/cover", filePicker.files[0]).then((response) => {
      this.args.community.cover = response;
      this.processingCover = false;
    });
  }

  @action	uploadLogo() {
    this.processingLogo = true;
    const filePicker = document.getElementById("logo-image-upload");
    this.cloudinary.uploadImage("communities/logo", filePicker.files[0]).then((response) => {
      this.args.community.logo = response;
      this.processingLogo = false;
    });
  }

}
