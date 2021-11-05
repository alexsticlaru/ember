import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MapLocationPickerComponent extends Component {
  @service toast;
  @service intl;

  @tracked lat = this.args.lat;
  @tracked lng = this.args.lng;
  @tracked zoom = 10;
  @tracked newMarkerLat = this.args.lat;
  @tracked newMarkerLong = this.args.lng;

  get icon () {
    const svg = '<svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5554 12.3333C24.5554 21.321 12.9999 29.0247 12.9999 29.0247C12.9999 29.0247 1.44434 21.321 1.44434 12.3333C1.44434 9.2686 2.66179 6.3294 4.82888 4.16231C6.99597 1.99523 9.93517 0.777771 12.9999 0.777771C16.0646 0.777771 19.0038 1.99523 21.1709 4.16231C23.338 6.3294 24.5554 9.2686 24.5554 12.3333Z" fill="#FF7F47" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12.9998 16.1852C15.1271 16.1852 16.8517 14.4606 16.8517 12.3333C16.8517 10.206 15.1271 8.48148 12.9998 8.48148C10.8725 8.48148 9.14795 10.206 9.14795 12.3333C9.14795 14.4606 10.8725 16.1852 12.9998 16.1852Z" stroke="#D15E2C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/> </svg> ';
    const iconsvg = 'data:image/svg+xml;base64,' + btoa(svg);

    return L.icon({
				className: 'edit-marker-icon',
				iconUrl: iconsvg,
				iconSize:     [26, 30], // size of the icon
				iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
				popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
		});
  }

  @action updateLocation(e) {
    let location = e.target.getLatLng();
    this.args.updateLocation(location.lat, location.lng);
  }

  @action addSearchMarker(e) {
      let location = e.latlng;
      this.newMarkerLat = location.lat;
      this.newMarkerLong = location.lng;
  }

  @action addressSearch() {
    if (this.addressSearchString) {
      const _this = this;

      $.getJSON("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + this.addressSearchString)
				.then(function(json) {
          //this can be used to have more than one result, just change the limit to e.g. 5 in the above query
          //then use the below to map the results
          $.each(json, function(key, val) {
            //set center
            _this.lat = val.lat;
            _this.lng = val.lon;
            //set newmarker loc
            _this.newMarkerLat = val.lat;
            _this.newMarkerLong = val.lon;

            // if (val.type == 'city' || val.type == 'administrative') {
            //   _this.zoom = 11;
            // } else if (val.type == 'house' || val.type == 'apartments'){
            //   _this.zoom = 17;
            // } else {
            //   _this.zoom = 13;
            // }
          });
        });
    }
  }

  @action getUserLocation() {
		const _this = this;

		navigator.geolocation.getCurrentPosition(function(position) {
      _this.lat = position.coords.latitude;
      _this.lng = position.coords.longitude;
      //set newmarker loc
      _this.newMarkerLat = position.coords.latitude;
      _this.newMarkerLong = position.coords.longitude;

      _this.zoom = 15;
			//with this setTimeout I tried to avoid a bug that comes from setting the zoomLevel before the correct latlong are rendered
			// setTimeout(function () {
      //   _this.zoom = 15;
			// }, 300);
      }, function() {
				_this.toast.error(_this.intl.t('participatoryMap.userLocationErrorBubble'));
      })
	}


}
