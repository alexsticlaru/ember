import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class ActSideInfoComponent extends Component {
  @tracked isExpanded = false;

  get bestAssertions () {
    return this.args.assertions.slice(0, 3);
  }

  @action expandWaysOfParticipating() {
    this.isExpanded = !this.isExpanded;
  }


}
