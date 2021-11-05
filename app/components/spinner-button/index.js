import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ButtonSpinner extends Component {

	@action onClick(){
		if(this.args.onClick)//if this.args.submitType is true the submit event may be handled somewhere else
			this.args.onClick(this);
	}
}
