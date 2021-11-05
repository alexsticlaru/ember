import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class SettingsAddModulesController extends Controller {
	@service store;
	@service toast;
	@service intl;

	@action addQuestionnaire() {
		let numberOfQuestionnaires = 1;
		this.model.project.participationPack.forEach((item) => {
			if (item.type == "questionnaire") {
				numberOfQuestionnaires= numberOfQuestionnaires +1;
			}
		});
		let uuid = Date.now();

		this.store.createRecord('participation-pack', {
			project: this.model.project,
			title: "Questionnaire "+numberOfQuestionnaires,
			name: "Questionnaire "+numberOfQuestionnaires,
			url: "questionnaire-"+uuid,
			type: "questionnaire",
			published: false
		}).save().then(() => {
			this.toast.success(this.intl.t('pb.projects.savedChanges'));
		});
	}


		@action addDiscussion() {
			let numberOfConsultations = 1;
			this.model.project.participationPack.forEach((item) => {
				if (item.type == "consultation") {
					numberOfConsultations= numberOfConsultations +1;
				}
			});
			let uuid = Date.now();

			this.store.createRecord('participation-pack', {
				project: this.model.project,
				community: this.model.project.get('community'),
				title: "Discussion "+numberOfConsultations,
				name: "Discussion "+numberOfConsultations,
				url: "discussion-"+uuid,
				type: "consultation",
				published: false
			}).save().then(() => {
				this.toast.success(this.intl.t('pb.projects.savedChanges'));
			});
		}

}
