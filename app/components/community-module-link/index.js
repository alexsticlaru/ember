import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommunityModule extends Component {
    @service sidePanel;

    get routeName() {
        if (this.args.item.type === 'consultation') {
            return `community.participation.consultation.act`
        } else {
            return `community.participation.${this.args.item.type}`
        }
    }
    
    @action
    showParticipationInfo(event) {
        event.preventDefault();
        event.stopPropagation();
        this.sidePanel.showSidePanel('community.participation.phone.participation-info', this.args.item, 'community.participation.phone.participation-info');
    }
}    