import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ParticipationTabs extends Component {
    @tracked showParticipate = true;
    @tracked showEvents = false;
    @tracked showAbout = false;

    get sortedParticipationPacks() {
		return this.args.model.participationPacks
			.reject((module) => module.type === 'custom')
			.sortBy('orderNumber');
    }
    
    get aboutModule() {
		return this.args.model.participationPacks.find(module => module.type === 'custom');
	}

    @action
    handleShowParticipate() {
        this.showParticipate = true;
        this.showEvents = false;
        this.showAbout = false;
    }

    @action
    handleShowEvents() {
        this.showParticipate = false;
        this.showEvents = true;
        this.showAbout = false;
    }

    @action
    handleShowAbout() {
        this.showParticipate = false;
        this.showEvents = false;
        this.showAbout = true;
    }
}