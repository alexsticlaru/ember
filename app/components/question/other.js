import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';

export default class OtherComponent extends Component {

    @tracked showInput = false;
    @tracked textAnswered = this.args.answer.answerText;

    get isTextAnswered() {
        return !isEmpty(this.textAnswered);
    }

    @action
    handleOtherClick() {
        this.showInput = !this.showInput;
    }

    @action
    focus(element) {
        element.focus(); 
    }

    @action
    handleAnswer(textAnswer) {
        this.showInput = false;
        this.args.onAnswerEntered(textAnswer);
    }
}