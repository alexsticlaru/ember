import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class PropositionItemComponent extends Component {

	@action saveEditedProposition() {
		this.args.proposition.save();
		this.args.enableEditProposition();
	}


}
