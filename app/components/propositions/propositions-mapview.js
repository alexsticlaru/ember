import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class PropositionsMapview extends Component {

  constructor() {
    super(...arguments);
    //removing footer when mapview is opened else too much scrolling
    if (document.getElementById('footer-query')) {
      const footer = document.getElementById('footer-query');
      footer.style.display="none";
    }
  }

  willDestroy() {
    //adding footer again when mapview is closed
    if (document.getElementById('footer-query')) {
      const footer = document.getElementById('footer-query');
      footer.style.display="block";
    }
  }

  @action scrollToMarkerItem (proposition) {
    const markerID = "proposition-id-" + proposition.id;
    const markerList = document.getElementById("propositions-marker-list");
    const markerIDoffset = document.getElementById(markerID).offsetTop - document.getElementById(markerID).parentElement.offsetTop - 20;
    markerList.scroll({
      top: markerIDoffset,
      behavior: 'smooth'
    });

    this.args.highlightProposition(proposition);
  }

  @action scrollToMarkerMobileItem (proposition) {
    const markerID = "proposition-id-" + proposition.id;
    //improve in the future:
    document.getElementById(markerID).scrollIntoView({behavior: "smooth", block: "end"});

    this.args.highlightProposition(proposition);
  }

  @action showOnMap (proposition) {
    //why I use the participation pack here, no idea..
		this.args.ideaBox.latitude = proposition.latitude;
		this.args.ideaBox.longitude = proposition.longitude;
		this.args.ideaBox.zoomLevel = 13;

		this.args.highlightProposition(proposition);
	}


  @action getUserLocation () {
    const _this = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      _this.args.ideaBox.latitude = position.coords.latitude;
      _this.args.ideaBox.longitude = position.coords.longitude;
      _this.args.ideaBox.zoomLevel = 15;
    }).catch((err) => {
      console.log(err);
    });
  }


}
