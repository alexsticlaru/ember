import Component from '@glimmer/component';
import { action } from '@ember/object';
import {tracked} from "@glimmer/tracking";

export default class HtmlMaxChar extends Component {
/*
	showMoreButton = true;
	showMoreAction = null;*/

	get displayedText(){
		let divRender = document.createElement('div');
console.error("this.displayedText (0, "+this.args.maxChar+") = "+this.args.text.substring(0, this.args.maxChar));
		return this.args.text.substring(0, this.args.maxChar);
	};

}
