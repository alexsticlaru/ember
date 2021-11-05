import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class HeaderDropdown extends Component {

    @action
    calculatePosition() {
        let style = {
          left: this.args.left ?  this.args.left : 0,
          top: this.args.top ? this.args.top : 67
        };

        return { style };
    }

    get triggerClass() {
        return this.args.triggerClass ?? 'dropdown__trigger'
    }

}
