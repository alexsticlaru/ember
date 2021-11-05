import Component from '@glimmer/component';

export default class PropositionsList extends Component {

    get propositionsEven() {
        return this.args.propositions.filter((proposition, index) => index % 2 === 0);
    }    
    
    get propositionsOdd() {
        return this.args.propositions.filter((proposition, index) => index % 2 !== 0);
    }
}