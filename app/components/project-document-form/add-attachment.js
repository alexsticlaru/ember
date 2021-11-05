import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DocumentAttachmentComponent extends Component {
	@service store;
	@service popup;
	@service linkPreview;
	@service cloudinary;
	@service intl;
	@service video;

  @action addPicture() {
    const filePicker = document.getElementById("picture-upload");

		const docPart = this.store.createRecord('link', {
			title: filePicker.files[0].name,
			section: this.args.section,
			isProcessing: true
		});
		this.args.documentParts.pushObject(docPart);

		this.cloudinary.uploadImage("issue", filePicker.files[0]).then((response) => {
        const imgURL = "https://res.cloudinary.com/civocracy/image/upload/v1612456390/" + response.toString();
        docPart.cloudinaryID = response.toString();
        docPart.image = response.toString();
				docPart.url = imgURL;
				docPart.isProcessing = false;
      });
  }

  @action addAttachment() {
    const filePicker = document.getElementById("file-upload");

		const docPart = this.store.createRecord('link', {
			title: filePicker.files[0].name,
			section: this.args.section,
			isProcessing: true
		});
		this.args.documentParts.pushObject(docPart);

		this.cloudinary.uploadFile("issue", filePicker.files[0]).then((response) => {
        const attachmentURL = "http://res.cloudinary.com/civocracy/raw/upload/v1612877100/" + response.toString();
        docPart.cloudinaryID = response.toString();
        docPart.url = attachmentURL;
				docPart.isProcessing = false;
      });
  }

	@action openLinkChoosingPopup() {
		const _this = this;
		let successFunction = function(url) {
			if (!url.startsWith('http') && !url.startsWith('https')){
				url = 'https://' + url
			}
			_this.addLink(url);
		}
		const popupModel = {
			popupTitle: this.intl.t('issue.contributionAddForm.addLinkPopupTitle'),
			confirm: this.intl.t('issue.contributionAddForm.addLinkPopupConfirm'),
			cancel: this.intl.t('issue.contributionAddForm.addLinkPopupCancel'),
		};
		this.popup.showPopup("add-link-popup", popupModel, successFunction);
	}

  @action addLink(url) {
		const docPart = this.store.createRecord('link', {
			section: this.args.section,
			title: url,
			url
		});
		this.args.documentParts.pushObject(docPart);

    this.linkPreview.getPreviewData(url).then(data => {
        if (data.host && data.host != "") {
          docPart.title = data.host;
        }
        docPart.image = data.image;
      });

      if (this.video.isVideo(url)) {
        docPart.url = this.video.convertMediaUrlToVideoEmbed(url);
      }
    }

}
