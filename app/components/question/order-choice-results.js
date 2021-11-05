import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class OneChoice extends Component {
    @tracked showOwnChoice = true;

    get userAnswers() {
        return this.args.question.results.sortBy('userOrderNumber');
    }

    get results() {
        return this.args.question.results.sortBy('orderNumber');
    }

    @action
    toggleOwnChoice() {
        this.showOwnChoice = !this.showOwnChoice;
    }
}    