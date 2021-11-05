import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class ShareService extends Service {
  @service popup;
  @service intl;
  // @service linkPreview;

  showPopup(shareModel) {
    if (navigator.share) {
      navigator.share(shareModel).then(() => {
        console.log("Thanks for sharing");
      }).catch(() => {
        console.log("sth went wrong");
      });
    } else {
      // shareModel.shareInfo = {
      //   title: "Civocracy",
      //   description: shareModel.url
      // };
      // this.linkPreview.getPreviewData(shareModel.url).then((result) => {
      //   shareModel.shareInfo = result;
      // });

      this.popup.showPopup("share-popup", shareModel);
    }
	}

}
