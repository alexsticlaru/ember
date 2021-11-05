import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Card extends Component {

    get communityUrl() {
        return {community_url: this.args.location.url}
    }

    @action
    handleCardClose(e) {
        e.preventDefault()
        e.stopImmediatePropagation();
        this.args.onClose();
    }

};
