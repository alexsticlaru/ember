import Component from '@glimmer/component';
import europeTopo from '../../utils/europeGeom';
import southAmericaTopo from '../../utils/southAmericaGeom';
import africaTopo from '../../utils/africaGeom';
import topojson from 'topojson';
import { select } from 'd3-selection';
import { geoPath, geoMercator } from 'd3-geo';
import { highlightedCountries } from '../../utils/homepage-location-map-values';
import { action } from '@ember/object';

export default class LocationMap extends Component {

  geoAreaLocationList = [];

  get currHovered() {
    const currClicked = this.args.currClicked;
    const currHovered = this.args.currHovered;
    if (this.points) {
      this.points
        .attr("stroke-width", d => currHovered === d || currClicked === d ? "4" : "1")
      .attr("fill", d => this.getCircleColor(d, (currClicked === d)) )
    }
    return currHovered;
  }

  @action
  setupMap(element) {
    const container = select(`.${this.args.geoArea}`);
    this.svg = container.select('.location-map__svg');
    this.g = container.select('.location-map__inner-container');
    this.mapPointRadius = this.args.mapPointRadius;

    this.setDimensions(element);
    this.setGeometry();
    this.setPointShadow();
    this.buildMap();
    this.updatePointsOnMap();
  }

  updatePointsOnMap() {
    this.points.attr("stroke-width", d => this.args.currHovered === d || this.args.currClicked === d ? "4" : "1");
    this.points.attr("r", this.mapPointRadius);
    this.points.attr("stroke-width", d => this.args.currClicked === d ? "4" : "1")
  }

  setDimensions(element) {
    const geoArea = this.args.geoArea;

    this.w = element.clientWidth;
    this.h = geoArea === 'south-america' || geoArea === 'africa' ? 5*this.w/4 : 8*this.w/7;

    this.svg.attr("height", this.h);
    let inbound = [ [0, 0], [this.w, this.h] ];
    if (geoArea === 'south-america') {
      this.projection = geoMercator()
        .center([ -58, -25 ])
        .translate([ this.w/2, this.h/2 ])
        .scale([ this.w*.9 ]);
        inbound = [ [0, 0], [document.querySelector('.south-america').clientWidth, document.querySelector('.south-america').clientHeight] ];
    } else if (geoArea === 'africa') {
      this.projection = geoMercator()
        .center([ 0, 0 ])
        .translate([ this.w/2, this.h/2 ])
        .scale([ this.w*1 ]);
        inbound = [ [0, 0], [document.querySelector('.africa').clientWidth, document.querySelector('.africa').clientHeight] ];     
    } else {
      this.projection = geoMercator()
        .center([ 5, 48 ])
        .translate([ this.w/2, this.h/2 ])
        .scale([ this.w*1.3 ]);
    }

    this.filterCommunities(inbound);

    this.path = geoPath()
      .projection(this.projection);
  }

  //We filter the communities by coordinates : if their long and or lat are outside the map dimensions we will not show them
  filterCommunities(inbound) {
    const geoArea = this.args.geoArea;
    let locList = this.args.locationList;
    locList = locList.filter((community) => {
      const clat = community.latitude, clong = community.longitude;
      if( geoArea==="africa" ){
        return clong > -17 && clong < 49 
             && clat > -35 && clat < 35;
      }else if( geoArea==="south-america" ){
        return clong > -82 && clong < -35
             && clat > -15 && clat < 60;
    
      }
      //for europe we use the maps internal coordinates ([0px, 0px] for north-west - [w, h] for south-east)
      let proj = this.getPositions([clong, clat]);
      if( proj[0] < inbound[0][0] || proj[0] > inbound[1][0] || proj[1] < inbound[0][1] || proj[1] > inbound[1][1] ){
        // console.error(geoArea + "-OUT! {"+community.get('name')+"("+clong+", "+clat+")}:", community, "-", idx);
        return false;
      }

      return true;
    });

    this.geoAreaLocationList = locList;
  }

  getPositions(coords){
    //translates the pixel offsets relative to the map container
    const geoArea = this.args.geoArea;
    const offset = 10;//10px for full width map (800px), reduce with ratio if smaller
    let transCoords = this.projection( coords ),
        x=transCoords[0], y=transCoords[1];
    if( geoArea === "south-america"){
        const w = document.querySelector('.location-map-container__inset-south-america').clientWidth
        const ratio = 136 / w;
        y -= (offset/ratio);
        x += (offset/ratio);
    }else if( geoArea === "africa" ){
        const w = document.querySelector('.location-map-container__inset-africa').clientWidth;
        const h= document.querySelector('.location-map-container__inset-africa').clientHeight;
        const ratio = 136 / w;
        //it is quite empiric... for now we only have "Les Masques Bleues" for Africa and it's ok but we are not sure other coordinates will match.
        y = ( transCoords[0]-(h/22) ) - (offset/ratio);
        x = ( transCoords[1]-(w/4.7) ) + (offset/ratio);
    }
    return [x, y];
}

  setGeometry() {
    const geoArea = this.args.geoArea;
    if (geoArea === 'south-america') {
      this.geometry = topojson.feature(southAmericaTopo, southAmericaTopo.objects.continent_South_America_subunits).features;
    } else if (geoArea === 'africa') { 
      this.geometry = topojson.feature(africaTopo, africaTopo.objects.continent_Africa_subunits).features;
    } else {
      this.geometry = topojson.feature(europeTopo, europeTopo.objects.europe).features;
    }
  }

  buildMap() {
    this.paths = this.g.selectAll("path")
      .data(this.geometry)
      .enter()
      .append("path");

    this.paths
			.attr("d", d => this.path(d))
      .attr("fill", d => highlightedCountries.indexOf(d.id) > -1 ? '#009ED8' : '#ecedee')
      .attr("stroke", "white")
      .attr("stroke-width", "1");
   
    this.points = this.g.selectAll("circle")
      .data(this.geoAreaLocationList)
      .enter().append("circle")
      .attr("fill", d => this.getCircleColor(d))
      .attr('r', this.mapPointRadius)
      .attr("cx", d => this.getPositions([d.get('longitude'), d.get('latitude')])[0])
			.attr("cy", d => this.getPositions([d.get('longitude'), d.get('latitude')])[1])
      .attr("stroke", d => this.getCircleColor(d))
      .attr("stroke-width", "1")
      .style('cursor', 'pointer')
      .style("filter", "url(#drop-shadow)")
      .on("mouseover", d => this.onPointMouseover(d))
      .on("mouseout", () => this.onPointMouseout())
			.on("click", d => this.onPointClick(d))
  }

  setPointShadow() {
    const filter = this.svg.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "200%")
      .attr("width", "200%");
      
      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      filter.append("feOffset")
          .attr("in", "SourceAlpha")
          .attr("dx", 5)
          .attr("dy", 5)
          .attr("result", "offsetResult");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
        .attr("in", "offsetResult")
        .attr("stdDeviation", 3)
        .attr("result", "offsetBlur");


    filter.append("feBlend")
        .attr("in", "SourceGraphic")
        .attr("in2", "offsetBlur")
        .attr("mode", "normal");  
  }

  getCircleColor(datum, active) {
    return datum.get('url') && datum.get('url').length ? (active ? "#FD6118" : "#FD9827" ) : "#ffff";
  }

  resizePointsRadius(element) {
    const containerWidth = element.clientWidth;
    let pointRadius = containerWidth/10;
		pointRadius = pointRadius > 10 ? 6 : 3;

		this.mapPointRadius = pointRadius;
  }

  @action
  resizeMap(resizeObs) {
    const element = resizeObs[0].target.children[0]
    this.setDimensions(element);
    this.paths
      .attr("d", d => this.path(d) );

    this.resizePointsRadius(element);  
    this.points
			.attr("cx", d => this.getPositions([d.get('longitude'), d.get('latitude')])[0])
			.attr("cy", d => this.getPositions([d.get('longitude'), d.get('latitude')])[1])
			.attr('r', this.mapPointRadius)
  }

  @action
	onPointMouseover(datum) {
			this.points
        .attr("stroke-width", d => datum === d ? "4" : "1");

      this.args.onMouseover(datum);
      this.args.onClick(datum);
	}

  @action
	onPointMouseout() {
		this.points
        .attr("stroke-width", d => this.args.currClicked === d ? "4" : "1");

    this.args.onMouseout();
	}

  @action
	onPointClick(datum) {
			if (this.args.currClicked && this.args.currClicked !== datum) {
				this.points
					.attr("stroke-width", d => datum === d ? "4" : "1")
        this.args.onClick(datum);
			}
	}
	
}
