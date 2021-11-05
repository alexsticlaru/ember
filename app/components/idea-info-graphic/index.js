import Component from '@glimmer/component';

export default class IdeaInfoGraphic extends Component {

    get percentage() {
      //the 50 here is a placeholder for now, but will be changed to this.args.maxProgress
        return this.args.progress / this.args.maxProgress;
    }

    get firstThird() {
        if (this.percentage < 0.33 && this.percentage ==0) {
          return true;
        }
        return false;
    }

    get secondThird() {
      if (this.percentage < 0.66 ) {
        return true;
      }
      return false;
    }

    get thirdThird() {
      if (this.percentage < 0.99 ) {
        return true;
      }
      return false;
    }


}
