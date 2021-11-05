import { inject as service } from '@ember/service';
import { filterBy, sort, alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import Model, { attr, belongsTo, hasMany  } from '@ember-data/model';
import supportedCountryFlags from "civ/utils/flags";

/**
 * This is the COMMUNITY model.
 * @class {Model} Community
 */
export default class Community extends Model {

	@service toast;
	@service intl;

	// Model attrs
	@attr('string', { defaultValue: 'community' }) type;
	@attr('string', { defaultValue: 'classicBottomUp' }) bottomUpLevel;
	@attr('boolean', { defaultValue: false }) branded;
	@attr('string') code;
	@attr('string') color;
	@attr('number', { defaultValue: 0 }) globalRelevancy;
	@attr('string') introMessage;
	@attr('boolean') isActive;
	@attr('boolean') realtime;
	@attr('boolean', { defaultValue: true }) isDirectResult;
	@attr('number') level;
	@attr('string') name;
	@attr('string') orgName;
	@attr('string') country;
	@attr recommendations;
	@attr('string') status;
	@attr('number', { defaultValue: 0 }) moderatedPropositionsCount;
	@attr('number') tutoDismissableAtStep;
	@attr({ defaultValue: () => [] }) uiSettings;
	@attr('string') url;
	@attr({ defaultValue: () => {}}) stats;
	@attr('boolean') forceLanguage;
	@attr('string') typeformWorkspaceId;
	@attr('string') typeformThemeId;
	@attr('number') latitude;
	@attr('number') longitude;
	@hasMany('pm-marker') pmMarkers;
	@attr('string', { defaultValue: "#095d8a"}) colorMain;
	@attr('string', { defaultValue: "#0091cd"}) colorSecondary;
	@attr('string', { defaultValue: "#E7C734"}) colorAccent;

	@hasMany('theme') themes;//not populated, why ?? Themes are available in model.themes but they should be the default themes, here we want the community themes alone. Maybe we'll have to filter themes from model.themes in route::community::afterModel or here in didLoad / didUpdate or ready... to store the community themes here only. Customised themes are in development for now, then to review and FIXME later...
	@belongsTo('community-following') userCommunityFollowing;
	@hasMany('community-following') userCommunityFollowings;
	@attr('string') locale;
	@attr('string') description;
	get htmlDescription(){
		if(!this.description)return "";
		return this.description.replace(/\n/g, '<br>');
	}

	@attr('string') descriptionOriginal;
	@attr('string') localeOriginal;
	@attr('boolean', {defaultValue: false}) translated;
	@attr('string', {defaultValue: 'communities/cover/default'}) cover;

	@attr('string') homepageUrl;
	@attr('string') twitterUrl;
	@attr('string') linkedinUrl;
	@attr('string') youtubeUrl;
	@attr('string') facebookUrl;

	// Attrs with computed properties
	get colorMainTransparent() {
		if(!isEmpty(this.colorMain)){
			const colorMain = this.colorMain;
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorMain);
			return "rgba("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+","+"0.2)";
		} else{
			return '';
		}
	}

	get colorSecondaryTransparent() {
		if(!isEmpty(this.colorSecondary)){
			const colorSecondary = this.colorSecondary;
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorSecondary);
			return "rgba("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+","+"0.2)";
		} else{
			return '';
		}
	}

	get colorAccentTransparent() {
		if(!isEmpty(this.colorAccent)){
			const colorAccent = this.colorAccent;
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorAccent);
			return "rgba("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+","+"0.2)";
		} else{
			return '';
		}
	}

	get shortDescription() {
		const description = this.description;
		if (description == null) {
			return '';
		} else if (description.length > 180) {
			return (description.substr(0, 180) + '…');
		} else {
			return description;
		}
	}


	@attr('string') image;
	get computedImage() {
		return isEmpty(this.image) ?
			'communities/image/default' : this.image;
	}

	@attr('string') logo;
    @hasMany('community-association', { inverse: 'content'}) associations;
    @hasMany('community-update') communityUpdates;



	// Sections logic

	@hasMany('section') sections;
	sectionsSorting = ['priority'];

/* DEPRECATED see https://deprecations.emberjs.com/v3.x/#toc_computed-property-property
	@filterBy('sections', 'status', 'active')
						.property('sections.@each.title', 'sections.@each.url', 'sections.@each.status') activeSections;
									// see: https://stackoverflow.com/questions/23455752
*/
	@filterBy( 'sections', 'status', 'active') activeSections;

	@sort('activeSections', 'sectionsSorting') orderedSections;
	/**
	 * Add a custom section to the community.
	 * @method addSection
	 * @param {String} title
	 * @param {String} content
	 */
	addSection(title, content) {
		const _this = this;
		const maxPrio = this.get('orderedSections.lastObject.priority') || 0 ;

		if ( !title ) {
			let n = this.get('sections.length') ;
			title = 'New section' + ( n===0 ? '' : ` ${n-1}` ) ;
		}

		const section = this.get('store').createRecord('section', {
			community: this,
			title: title,
			url: title.dasherize(),
			content: content,
			priority: maxPrio + 1,
			status: 'active'
		}) ;

		return section.save().then( function () {
			_this.get('sections').pushObject(section) ;
			return section ;
		})
	}

	/**
	 * Remove a custom section from the community.
	 * @method removeSection
	 */
	removeSection(section) {
		const intl = this.get('intl');
		const toast = this.get('toast');

		return section.destroyRecord().then(function () {
			toast.success(
				intl.t('delete.successMessage.communitySection'),
				intl.t('delete.successTitle.communitySection')
			);
		}).catch(function () {
			toast.error(
				intl.t('delete.successMessage.communitySection'),
				intl.t('delete.successTitle.communitySection')
			);
		});
	}

	/**
	* Moves a section in the list.
	 * @method moveSection
	 */
	moveSection(section, from, to) {
		const movesDown = (from < to);
		let sections = this.get('orderedSections');
		let promises = [] ;

		if ( from === to ) {
			return RSVP.resolve() ;
		}

		if ( movesDown ) {
			// Decrement priority of all sections
			// located before target
			sections = sections.slice(from+1, to+1) ;
			sections.forEach( function (s) {
				s.decrementProperty('priority') ;
				promises.push( s.save() ) ;
			}) ;
		}

		else {
			// Increment priority of all sections
			// located after target
			sections = sections.slice(to, from) ;
			sections.forEach( function (s) {
				s.incrementProperty('priority') ;
				promises.push( s.save());
			}) ;
		}

		section.set('priority', to) ;
		promises.push( section.save());

		return RSVP.all(promises);
	}

	// Community tree logic

	@belongsTo('community', {
		inverse: 'communities',
		async: false
	}) root;

	@hasMany('community', {
		inverse: 'root'
	}) communities;

	// FIXME: add more explanation
	// for the tree logic
	get tree() {
		const tree = [this];
		let root = this.get('root');
		while ( root ) {
			tree.push(root) ;
			root = root.get('root') ;
		}
		return tree ;
	}

	/**
	 * Subpages have both:
	 *	  - a root
	 *   	- a community-association with their root.
	 * @property {Boolean} isSubpage
	 */
	@attr('boolean') isSubpage;

	/**
	 * Not-to-be mixed with "root" !
	 *
	 * The parent community is the first root
	 * community in the tree not to be flagged
	 * as "isSubpage".
	 *
	 * @property {Community} parent
	 */
	@filterBy('tree', 'isSubpage', false) _parentTree;
	@alias('_parentTree.firstObject') parent;

	@belongsTo('quest-form', {
		inverse: 'isCommunityQuestionnaire'
	}) haveInscriptionQuestionnaire;

    @hasMany('quest-form') questionnaires;
	@attr('boolean') v7redirect;
	@attr('number') participantsCount;

	/**
	 * determine country name based on country code (2 letters)
	 * country codes > https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	 * @returns {string}
	 */
	get countryName() {
		let country = this.country.toString();
		switch(country == 'France') {
			case 'England': country = 'EN';
			case 'UK': country = 'EN';
			case 'Germany': country = 'DE';
			case 'Spain': country = 'ES';
			case 'France': country = 'FR';
			case 'Netherlands': country = 'NL';
			case 'Croatia': country = 'HR';
			default: break;
		}
		return this.intl.t('countries.' + country);
	}

	/**
	 * determine flag filename based on country code
	 * country codes > https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	 * flags > http://hjnilsson.github.io/country-flags/
	 * @returns {string|null}
	 */
	get countryFlagFilename() {
		let countryCode = this.country.toLowerCase();
		if (countryCode == 'gf' || countryCode == 'france') {
			countryCode = 'fr';
		}
		if (countryCode == 'nl') {
			countryCode = 'af';
		}

		// is there a flag image for this country?
		if (!supportedCountryFlags.includes(countryCode)) {
			return null;
		}

		return '/images/flags/' + countryCode + '.svg';

	}
}
