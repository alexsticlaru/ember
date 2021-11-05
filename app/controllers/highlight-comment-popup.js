import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HighlightCommentController extends Controller {
  @service user;
  @service store;
  @service popup;
  @tracked assertionText = null;
  @tracked assertionTextToLong = false;

  get SelectedText() {
    if (typeof window.getSelection != "undefined") {
      return window.getSelection().toString().replace(/<\/?[^>]+(>|$)/g, "").trim();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      return document.selection.createRange().text.replace(/<\/?[^>]+(>|$)/g, "").trim();
    }
    return null;
  }

  get numberOfHighlightsLeft() {
    return 3 - this.model.assertions.length;
  }

  @action saveHighlight() {
    if (this.assertionText.length > 3) {
      const newRecord = this.store.createRecord('assertion', {
        text: this.assertionText,
        status: "active",
        type: "idea",
        date: new Date(),
        issue: this.model.issue,
        content: this.model,
        addedBy: this.user.getCurrentUser(),
      });
      this.popup.close();
      newRecord.save().then( (record) => {
       this.model.assertions.pushObject(record);
    });
    }
  }

  @action highlightText() {

    if (this.SelectedText && this.SelectedText!= "" && this.SelectedText.length>3) {
      if (this.SelectedText.length>140) {
        this.assertionTextToLong = true;
        this.assertionText = null;
      } else {
        this.assertionTextToLong = false;
        this.assertionText = this.SelectedText;
      }
      //
      // document.querySelectorAll('.highlight-comment-popup__selected-text').forEach(function(elem){
      //   elem.classList.remove("highlight-comment-popup__selected-text");
      // });
      //
      // const span = document.createElement("span");
      // span.classList.add("highlight-comment-popup__selected-text");
      //
      // const selection = window.getSelection();
      // const range = selection.getRangeAt(0).cloneRange();
      // if (range) {
      //   range.surroundContents(span);
      //   selection.removeAllRanges();
      //   selection.addRange(range);
      // }
		}
  }

  @action closePopup() {
    this.assertionText = "";
    this.popup.close();
  }

}
