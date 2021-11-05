import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class Dropdown extends Component {

    @tracked contentOpen = false;

    get triggerAction() {
        return this.args.triggerAction ?? 'click'
    }

    get triggerClass() {
        return this.args.triggerClass ?? 'dropdown__trigger'
    }

    get contentClass() {
        return this.args.contentClass ?? 'dropdown__content'
    }

    @action
    markStillOpen() {
        this.contentOpen = true;
    }

    @action
    openContent(dropdown, e) {
        e.stopImmediatePropagation();
        dropdown.actions.open(e);
        if (this.args.onContentOpen) {
            this.args.onContentOpen();
        }
    }

    @action
    calculatePosition() {
        let style = {
          left: this.args.left ?  this.args.left : 0,
          top: this.args.top ? this.args.top : 0
        };

        return { style };
    }

    @action
    closeContent(dropdown, e) {
        dropdown.actions.close(e);
        this.contentOpen = false;
        if (this.args.onContentClose) {
            this.args.onContentClose();
        }
    }

    @action
    checkContent(dropdown, e) {
       debounce(this, () => {
           if (!this.contentOpen) {
               this.closeContent(dropdown, e);
           }
       }, 150);
    }
}
