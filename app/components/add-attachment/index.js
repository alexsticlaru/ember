import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AddAttachmentComponent extends Component {
	@service store;
	@service popup;
	@service linkPreview;
	@service cloudinary;
	@service intl;
	@service video;

  @action addPicture() {
    const filePicker = document.getElementById("picture-upload");

    const commentAttachment = this.store.createRecord('comment-attachment', {
        type: "picture",
        content: this.args.model,
      });

      commentAttachment.description = filePicker.files[0].name;

      this.cloudinary.uploadImage("issue", filePicker.files[0]).then((response) => {
        const imgURL = "https://res.cloudinary.com/civocracy/image/upload/v1612456390/" + response.toString();
        commentAttachment.cloudinaryID = response.toString();
        commentAttachment.image = imgURL;
        commentAttachment.url = imgURL;
      });
  }

  @action addAttachment() {
    const filePicker = document.getElementById("file-upload");

    const commentAttachment = this.store.createRecord('comment-attachment', {
        type: "file",
        content: this.args.model,
      });

      commentAttachment.name = filePicker.files[0].name;

      this.cloudinary.uploadFile("issue", filePicker.files[0]).then((response) => {
        const attachmentURL = "http://res.cloudinary.com/civocracy/raw/upload/v1612877100/" + response.toString();
        commentAttachment.cloudinaryID = response.toString();
        commentAttachment.url = attachmentURL;
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
    const commentAttachment = this.store.createRecord('comment-attachment', {
        url,
        type: "link",
        name: url,
        content: this.args.model,
      });

      this.linkPreview.getPreviewData(url).then(data => {
        if (data.host && data.host != "") {
          commentAttachment.name = data.host;
        }
        if (data.title && data.title != "") {
          commentAttachment.description = data.title;
        }
        commentAttachment.image = data.image;
      });

      if (this.video.isVideo(url)) {
        commentAttachment.type = "video";
        commentAttachment.url = this.video.convertMediaUrlToVideoEmbed(url);
      }
    }

}
