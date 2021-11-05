import Component from '@glimmer/component';
import config from '../../config/environment';


export default class CardsSection extends Component {
	get config() {
		return config;
	}
}
