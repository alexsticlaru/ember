import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class RegisterChooser extends Component {
    @tracked termsAgree = false;
    @tracked privacyAgree = false;
    @tracked showNoAgreement = false;

    get isAgreementAccepted() {
        return this.termsAgree && this.privacyAgree
    }

    @action
    goToRegistrationForm() {
        this.args.onRegistrationClick();
    }
}