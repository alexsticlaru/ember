import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AddAssertionButtonComponent extends Component {
  @service user;
	@service store;

	@tracked assertionText = "";

  get SelectedText() {
    if (typeof window.getSelection != "undefined") {
      return window.getSelection().toString().replace(/<\/?[^>]+(>|$)/g, "").trim();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      return document.selection.createRange().text.replace(/<\/?[^>]+(>|$)/g, "").trim();
    }
    return null;
  }

  get assertionsBelowLimit() {
    return this.args.model.assertions.length<3;
  }

  @action openHighlightMenu() {
		if (this.SelectedText && this.SelectedText!= "" && this.assertionsBelowLimit) {
			const highlightmenu = document.getElementById('highlightbutton-menu');
			const selectionRect= window.getSelection().getRangeAt(0).getBoundingClientRect();
			highlightmenu.style.display = 'block';
			highlightmenu.style.top = ( selectionRect.top - 42 )+ 'px';
			highlightmenu.style.left = ( selectionRect.left - (highlightmenu.offsetWidth / 2) + (selectionRect.width * 0.5)) + 'px';
			this.assertionText = this.SelectedText;
		} else {
			this.closeHighlightMenu();
		}
	}

  @action addAssertion() {
    this.closeHighlightMenu();

    this.store.createRecord('assertion', {
      text: this.assertionText,
      status: "active",
      type: "idea",
      date: new Date(),
      issue: this.args.model.issue,
      content: this.args.model,
      addedBy: this.user.getCurrentUser(),
    });
  }

  @action closeHighlightMenu() {
    document.getElementById('highlightbutton-menu').style.display = 'none';
  }

}
