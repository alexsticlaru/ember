import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import environment from 'civ/config/environment';

export default class QuestionnaireManagementComponent extends Component {
  @service store;
  @service toast;
  @service cloudinary;
  @service router;
  @service intl;
  @service popup;

  @tracked processingImage=false;
  @tracked processingChanges=false;
  @tracked changesSaved= false;
  @tracked activeTab = "setup";

	get questionnaire() {
		return this.store.peekRecord('quest-form', this.args.participationPack.questionnaire.get('id'));
	}

  get downloadUrlXlsx() {
    return environment.APP.API_HOST + "/api/exports/questionnaires_results/" + this.questionnaire.id + '?format=xlsx&locale=' + this.intl.locale;
  }

  get downloadUrlOds() {
    return environment.APP.API_HOST + "/api/exports/questionnaires_results/" + this.questionnaire.id + '?format=ods&locale=' + this.intl.locale;
  }

  get downloadUrlCsv() {
    return environment.APP.API_HOST + "/api/exports/questionnaires_results/" + this.questionnaire.id + '?format=csv&locale=' + this.intl.locale;
  }

  get dateBeginArray(){
    return [this.args.participationPack.dateBegin];
  }

  get dateEndArray(){
    return [this.args.participationPack.dateEnd];
  }

  @action publish() {
    this.args.participationPack.published = !this.args.participationPack.published;
    this.args.participationPack.save();
  }

  @action dateBeginChanged(newDate) {
    if (newDate) {
				this.args.participationPack.dateBegin = newDate[0];
			}
  }

  @action dateEndChanged(newDate) {
    if (newDate) {
				this.args.participationPack.dateEnd = newDate[0];
			}
  }

  @action changeTab(type) {
    this.activeTab = type;
  }

	@action saveQuestionnaire() {
    this.processingChanges = true;
		this.args.participationPack.save().then(() => {
			this.questionnaire.save().then(() => {
        this.processingChanges = false;
				this.toast.success(this.intl.t('pb.projects.savedChanges'));
        this.changesSaved = true;
        setTimeout(() => {
          this.changesSaved =false;
        }, 3000);
			});
		});
	}

  @action deleteQuestionnaire() {
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
    this.processingImage = true;
    const filePicker = document.getElementById("image-upload");
    this.cloudinary.uploadImage("communities", filePicker.files[0]).then((response) => {
      this.args.participationPack.image = response;
      this.processingImage = false;
    });
  }

  @action addQuestion() {
    this.store.createRecord('quest-question', {
      content: "",
      form: this.questionnaire,
      orderNr: this.questionnaire.questions.length +1,
      question: '',
      fieldType: 'text',
      required: false,
      allowOpenAnswer: false,
      rangeStart: 0,
      rangeEnd: 10
    });
  }
}
