import Component from '@glimmer/component';
import config from '../../config/environment';

export default class AboutProject extends Component {
	get config() {
		return config;
	}
}
