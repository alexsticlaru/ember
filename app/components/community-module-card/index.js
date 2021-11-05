import Component from '@glimmer/component';

export default class ModuleCard extends Component {

    get routeName() {
        if (this.args.item.type === 'consultation') {
            return `community.participation.consultation.act`
        } else {
            return `community.participation.${this.args.item.type}`
        }
    }

	/* we replaced this trunc by display: -webkit-box; and a clamp at 4 lines*/
    get title() {
// 		return this.args.item.title.length > 102 ? this.args.item.title.slice(0, 102) : this.args.item.title;
		return this.args.item.title;
	}

  get ariaId() {
    return "module-aria-id-" + this.args.item.id;
  }

    get titleClass() {
//         return this.args.item.title.length > 102 ? 'module-card__question-title-truncate' : 'module-card__question-title'
		return 'module-card__question-title';
    }
}
