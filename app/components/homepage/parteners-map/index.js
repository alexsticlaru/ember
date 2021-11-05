import Component from '@glimmer/component';
import EmberObject from '@ember/object';
import {
  africaLocations,
  southAmericaLocations
} from '../../../utils/homepage-location-map-values';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';


export default class PartenersMap extends Component {
	  
	@tracked currClicked = null;
	@tracked currHovered = null;
	mapPointRadius = 6;

	constructor() {
		super(...arguments);
	}

	get locationList() {
		return this.args.locations.filter(d => d.get('latitude') && d.get('longitude'))
	}

	get locationListAfrica() {
		return this.args.locations.filter(d => d.get('latitude') && d.get('longitude'));
	}

	get locationListSouthAmerica() {
		return this.args.locations.filter(d => d.get('latitude') && d.get('longitude'));
	}

	@action
	onMouseover(datum) {
		this.currHovered = datum;
	}

	@action
	onMouseout() {
		this.currHovered = null;
	}

	@action
	onClick(datum) {
		if (this.currClicked && this.currClicked === datum) {
			this.currClicked = null;
		} else {
			this.currClicked = datum;
		}
	}

	@action
	onClose() {
		this.currClicked = null;
	}
	
};
