import Component from '@glimmer/component';

export default class Pagination extends Component {

    get showPagination() {
      if (this.args.pagedContent && this.args.pagedContent.totalPages> 1) {
        return true;
      }
      return false;
    }
}
