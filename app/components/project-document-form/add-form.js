import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ProjectDocumentAddFormComponent extends Component {
  @service store;
  @service cloudinary;
  @service intl;
  @service popup;

  @tracked section;
  @tracked documentParts =[];

  constructor() {
    super(...arguments);
    let maxPrio = 0 ;
    maxPrio = this.args.project.sections.length ;

    this.section = this.store.createRecord('section', {
      community: this.args.project.community,
      project: this.args.project,
      priority: maxPrio + 1,
      linksEnabled: 1,
      status: 'active',
      date: new Date()
    });
  }

  @action addDocument() {
    this.section.url = this.section.title.dasherize(),

    this.section.save().then((section) => {
      this.documentParts.forEach((item) => {
        item.save();
      });

      //add to model
      this.args.project.sections.insertAt(0, section);
      this.args.onDocumentAdded();
    });
  }

  @action deletePart(documentPart) {
    documentPart.destroyRecord();
    this.documentParts = this.documentParts.filter(function(item) {
      return item.id!==documentPart.id;
    })
  }

  @action openPreview() {
		const sectionModel = {
			section: this.section,
			documentParts:this.documentParts
		};
		this.popup.showPopup("file-popup", sectionModel);
  }

}
