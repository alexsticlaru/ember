import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend( {
	intl: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attrs

	title: attr('string'),
	summary: attr('string'),
	date: attr('date'),
	count: attr('number'),
	url: attr('string'),
	status: attr('string'),
	isProcessing: attr('boolean'),

	// Foreign attrs
	type:'link',
	issue: belongsTo('issue'),
	user: belongsTo('user'),
	community: belongsTo('community'),
	section: belongsTo('section'),

	// Attrs with computed properties
	image: attr('string'),
	computedImage: computed('image', function () {
		if (this.get('image') && this.get('image').startsWith("http")) {
			return this.get('image') ;
		}
		//for old plattform images
		if (this.get('image') && this.get('image') != "") {
			return "https://res-2.cloudinary.com/civocracy/image/upload/h_300,w_595,c_lfill,q_auto,f_auto/" + this.get('image') ;
		}
		//return "not-found_qifo3a";
		return "https://res.cloudinary.com/civocracy/image/upload/static/sections/Web_link_icon-2235607-faded";
	}),

	computedVideoUrl: computed('url', function () {
		//this is where we can reformat url to work in our container used by link-item component :
		//<iframe width="640" height="360" src={{link.url}} frameborder="0" allowfullscreen></iframe>
		let url = this.get('url');
		if( url.indexOf("youtube.com/")>-1 ){
			//https://www.youtube.com/watch?v=onbPjqSOAPE => https://www.youtube.com/embed/onbPjqSOAPE
			url = "https://www.youtube.com/embed/"+url.substring( url.indexOf('?v=')+3 );
		}
		if( url.indexOf("youtu.be/")>-1 ){
			//https://youtu.be/onbPjqSOAPE => https://www.youtube.com/embed/onbPjqSOAPE
			url = "https://www.youtube.com/embed/"+url.substring( url.indexOf('youtu.be/')+9 );
		}
		return url;
	}),

	shortSummary: computed('summary', function () {
		let summary = this.get('summary') ;

		if (summary == null) {
			return '';
		} else if (summary.length > 300) {
			return (summary.substr(0, 300) + '...') ;
		} else {
			return summary;
		}
	}),

	/**
	 * Extracts the domain name from the link's URL.
	 */
	domain: computed('url', function () {
		let domain;
		let url = this.get('url') ;

		//find & remove protocol (http, ftp, etc.) and get domain
		if (url.indexOf("://") > -1)
			domain = url.split('/')[2] ;
		else
			domain = url.split('/')[0] ;
		//find & remove port number
		domain = domain.split(':')[0] ;

		return domain;
	}),

	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow() ;
	}),

	displayDateAsDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).format('YYYY-MM') ;
	}),

	// Don't send content tracking
	// request twice.
	viewed: false
}) ;
