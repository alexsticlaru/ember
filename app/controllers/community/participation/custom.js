import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class IntroductionController extends Controller {
	previewMode = true;

	@action
	updateValue(event) {
		console.log("hello");

	}

	constructor() {
		super(...arguments);
	}


}
