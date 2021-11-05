import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import environment from 'civ/config/environment';

export default class ConsultationManagementComponent extends Component {
  @service store;
  @service cloudinary;
  @service toast;
  @service intl;
  @service router;
  @service popup;

  @tracked activeTab = "setup";
  @tracked issue;
  @tracked processingImage=false;

  @tracked processingChanges=false;
  @tracked changesSaved= false;


  constructor() {
		super(...arguments);
    //experienced weird behaviour with the issue therefore this workaround
		this.issue = this.store.peekRecord('issue', this.args.participationPack.get("issue.id"));
	}

  get dateBeginArray(){
    return [this.issue.dateBegin];
  }

  get dateEndArray(){
    return [this.issue.dateEnd];
  }


  // get exportUrl() {
  //   return "To Do";
  // }

  @action publish() {
    this.args.participationPack.published = !this.args.participationPack.published;
    this.args.participationPack.save().then(() => {
      this.toast.success(this.intl.t('pb.projects.savedChanges'));
    });
  }

  @action changeTab(type) {
    this.activeTab = type;
  }

  @action dateBeginChanged(newDate) {
    if (newDate) {
				this.issue.dateBegin = newDate[0];
			}
  }

  @action dateEndChanged(newDate) {
    if (newDate) {
				this.issue.dateEnd = newDate[0];
			}
  }

  @action saveConsultation() {
    this.processingChanges = true;
    this.issue = this.store.peekRecord('issue', this.args.participationPack.get("issue.id"));

    this.args.participationPack.save().then(() => {
      this.issue.save().then(() => {
        this.processingChanges = false;
        this.toast.success(this.intl.t('pb.projects.savedChanges'));
        this.changesSaved = true;
        setTimeout(() => {
          this.changesSaved =false;
        }, 3000);
      });
    });
  }

  @action deleteConsultation() {
    const _this = this;
    let confirmFunction = function() {
      _this.args.participationPack.destroyRecord().then(() => {
        _this.router.transitionTo('community.participation.settings');
      });
    }
    const confirmMessage = {
      title: this.intl.t('delete.confirmMessage.modeTitle'),
      text: this.intl.t('delete.confirmMessage.modeText'),
      confirm: this.intl.t('buttons.propositionDeleteConfirm'),
      cancel: this.intl.t('buttons.propositionDeleteCancel'),
    };
    this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
  }

  @action	uploadImage() {
    this.issue = this.store.peekRecord('issue', this.args.participationPack.get("issue.id"));
    this.processingImage = true;
    const filePicker = document.getElementById("image-upload");
    this.cloudinary.uploadImage("communities", filePicker.files[0]).then((response) => {
      this.issue.image = response;
      this.processingImage = false;
    });
  }

}
