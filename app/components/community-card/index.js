import Component from '@glimmer/component';
import { action } from '@ember/object';
import {tracked} from "@glimmer/tracking";

export default class CommunityCard extends Component {
	@tracked isLongDescription = true;

	get projectsCount() {
		return this.args.community.projectsCount ?? 0;
	}

	get contributionsCount() {
		return this.args.community.contributionsCount ?? 0;
	}

	//we clean some html from the old v6 introMessage rich-text (iframes are used by video platforms : we don't want them here and anyway we would need cookies consent from the user):
	get cleanedCommunityIntroMessage(){
// 		alert( this.args.community.introMessage.replace(/(<a)(.*?)>/gi, "<a target=\"_blank\" aria-hidden=\"true\" tabIndex=\"-1\" $2>") );
// 		if(this.args.community.introMessage.length>130)
// 			this.isLongDescription = true;
		return this.args.community.introMessage.replace(/(<iframe(.*)+?<\/iframe>)/gi, '').replace(/(<a)(.*?)>/gi, '<a target="_blank" aria-hidden="true" tabIndex="-1" $2>'/*'<a$2 target="_blank" aria-hidden="true">'*/);
	}


	get cleanedCommunityDescription(){
// 		alert( this.args.community.introMessage.replace(/(<a)(.*?)>/gi, "<a target=\"_blank\" aria-hidden=\"true\" tabIndex=\"-1\" $2>") );
// 		if(this.args.community.description.length>130)
// 			this.isLongDescription = true;
		return this.args.community.description.replace(/(<iframe(.*)+?<\/iframe>)/gi, '').replace(/(<a)(.*?)>/gi, '<a target="_blank" aria-hidden="true" tabIndex="-1" $2>'/*'<a$2 target="_blank" aria-hidden="true">'*/);
	}

	/**
	 * detects when the 'descripttion' content is bigger than the div
	 * @param element
	 */
	// @action
	// descriptionDidInsert(element) {
	// 	if (element.scrollHeight > element.clientHeight) {
	// 		this.isLongDescription = true;
	// 	}
	// }

	@action showMore() {
		console.error('showMore');
	}

}
