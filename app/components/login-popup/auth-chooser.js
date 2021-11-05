import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { isEmpty } from '@ember/utils';

export default class AuthChooser extends Component {
	@service('debug') dbgS;
}
