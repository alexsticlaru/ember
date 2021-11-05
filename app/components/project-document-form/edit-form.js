import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ProjectDocumentEditFormComponent extends Component {
  @service store;
  @service toast;
  @service popup;
  @service router;
  @service intl;

  @tracked documentParts =[];
  @tracked processingChanges=false;
  @tracked changesSaved=false;

  constructor() {
    super(...arguments);
    this.store.query('link', {
      "filters[section.id]": parseInt(this.args.section.id),
      // "filters[status]": "active"
    }).then((result) => {
      this.documentParts =result.toArray();
    });
  }

  @action deletePart(documentPart) {
    documentPart.destroyRecord();
    this.documentParts = this.documentParts.filter(function(item) {
      return item.id!==documentPart.id;
    })
  }

  @action saveDocument() {
    this.processingChanges = true;
    this.args.section.save().then(() => {
      this.processingChanges = false;
      this.changesSaved = true;
      setTimeout(() => {
        this.changesSaved =false;
      }, 3000);
      this.documentParts.forEach((item) => {
        item.save();
      });
      this.toast.success(this.intl.t('pb.projects.savedChanges'));
      // this.router.transitionTo('community.participation.settings');
    });
  }

  // @action addTextPart() {
  //   const docPart = this.store.createRecord('link', {
  //     summary: " ",
  //     title: "Text Block",
  //     url: "no url",
  //     section: this.args.section
  //   });
  //   this.documentParts.pushObject(docPart);
  // }

  @action deleteDocument() {
    const _this = this;
    let confirmFunction = function() {
      _this.args.section.destroyRecord().then(() => {
        _this.router.transitionTo('community.participation.settings.documents');
      });
    }
    const confirmMessage = {
      title: this.intl.t('delete.confirmMessage.documentTitle'),
      text: this.intl.t('delete.confirmMessage.documentText'),
      confirm: this.intl.t('buttons.propositionDeleteConfirm'),
      cancel: this.intl.t('buttons.propositionDeleteCancel'),
    };
    this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
  }

  @action cancel() {
    this.router.transitionTo('community.participation.settings.documents');
  }


  @action openPreview() {
    const sectionModel = {
      section: this.args.section,
      documentParts:this.documentParts
    };
    this.popup.showPopup("file-popup", sectionModel);
  }



}
