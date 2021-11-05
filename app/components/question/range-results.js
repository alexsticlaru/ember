import Component from '@glimmer/component';
import { A } from '@ember/array';


export default class RangeResults extends Component {	
    
    get rangeValues() {
		let rangeArr = A([]);
		const rangeStart = parseInt(this.args.question.rangeStart);
		const rangeEnd = parseInt(this.args.question.rangeEnd)
		for (let i = rangeStart; i <= rangeEnd; i++) {
			rangeArr.pushObject(this.createRangeItem(i));
		}
		return rangeArr
	}

    createRangeItem(index) {
        const foundResult = this.args.question.results.find((result) => index === parseInt(result.answer));
        if (foundResult) {
            return foundResult;
        } else {
            return {
                answer: index,
                percentage: 0,
                userDidAnswer: false
            }
        }
    }
}
