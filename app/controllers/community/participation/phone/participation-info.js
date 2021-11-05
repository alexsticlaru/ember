import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ParticipationIntroController extends Controller {
    @service sidePanel;

    @action
    closePanel(){
        this.sidePanel.hideSidePanel();
    }
}