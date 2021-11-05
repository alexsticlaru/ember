import Component from '@glimmer/component';

export default class CircularProgressComponent extends Component {

  get dimensions(){
    if (this.args.dimensions) {
      return "width: " + this.args.dimensions + "px; height: "  + this.args.dimensions + "px;";
    }
    return "width: 120px; height: 120px;";
  }

}
