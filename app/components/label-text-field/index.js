import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class LabelTextField extends Component {

    get type() {
        return this.args.type ?? 'text'
    }

    get inputClass() {
      if (this.args.redesign) {
        return "label-text-redesign";
      } else if (this.args.noborder){
        return "label-text-noborder";
      } else {
        return "label-text";
      }
    }

    get height() {
      if (this.args.height) {
        return "height:" + this.args.height +"rem;";
      } else {
        return "height: 10rem";
      }
    }

    @action
    change() {
        if (this.args.onChange) {
            this.args.onChange();
        }
    }

    @action
    onInput() {
        if (this.args.onInput) {
            this.args.onInput();
        }
    }

	@action
	enterAction() {
		if (this.args.enterAction) {
			this.args.enterAction();
		}
	}

	@action
	focusOutAction() {
		if (this.args.focusOutAction) {
			this.args.focusOutAction();
		}
	}
}
