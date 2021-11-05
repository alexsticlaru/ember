import Component from '@glimmer/component';
import config from '../../config/environment';

export default class FooterComponent extends Component {

    get config() {
        return config;
    }
}
