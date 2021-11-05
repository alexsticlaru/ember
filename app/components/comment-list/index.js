import Component from '@glimmer/component';

export default class CommentList extends Component {

	get comments () {
		return this.args.comments?.sortBy('date').reverse();
	}
}
