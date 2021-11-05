import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Project extends Model {
	@service intl;

	@attr('string') name;

	@attr('string') description;
	get htmlDescription(){
		if(!this.description)return "";
		return this.description.replace(/\n/g, '<br>\n');
	}

	@attr('string') outcomeBenefits;
	get htmlOutcomeBenefits(){
		if(!this.outcomeBenefits)return "";
		return this.outcomeBenefits.replace(/\n/g, '<br>\n');
	}

	@attr('string') url;
	@attr('string', {defaultValue: "v1603454276/beta/issue/pk8ghaffrgeomie68xbx.jpeg"}) image;
	@attr('string') status;
	@belongsTo('community', { inverse: null }) community;
	@hasMany('participation-pack') participationPack;

	@hasMany('project-event') events;//use sortedProjectUpdates for direct listing, otherwise the updates are not sorted in the needed way
	get sortedEvents(){
		return this.events.sortBy('date').reverse();
	}

	@hasMany('project-update') projectUpdates;//use sortedProjectUpdates for direct listing, otherwise the updates are not sorted in the needed way
	get sortedProjectUpdates(){
		return this.projectUpdates.sortBy('date').reverse();
	}

	//the v6 sections become the "documents" in v7 !
	@hasMany('section') sections;//use sortedProjectSections for direct listing, otherwise the seconds are not sorted in the needed way
	//let's prefere the "section" entity name of the backend - documents = computed.alias("sections");
	get sortedProjectSections(){
		return this.sections.filter( item => item.status == 'active' ).sortBy('date').reverse();
	}

	@attr('number') participantsCount;
	@attr('number', {defaultValue: 0}) globalRelevancy;
	@attr('number') contributionsCount;
	@attr('date') dateBegin;
	@attr('date') dateEnd;
	@attr('boolean') private;
	@attr('string') password;



// 	@computed('dateBegin', 'intl.locale')
	get displayDateBegin() {
		var foo = this.intl.locale;
		return moment( this.dateBegin ).fromNow() ;
	};
// 	@computed('dateBegin', 'intl.locale')
	get calendarDateBegin() {
		var foo = this.intl.locale;//for whatever reason, even with the computed decoration, this is not recomputed when the local changes. Getting intl.locale fixes that...
		return moment( this.dateBegin ).format("L") ;
	};

// 	@computed('dateEnd', 'intl.locale')
	get displayDateEnd() {
		var foo = this.intl.locale;
		return moment( this.dateEnd ).fromNow() ;
	};
// 	@computed('dateEnd', 'intl.locale')
	get calendarDateEnd() {
		var foo = this.intl.locale;
		return moment( this.get('dateEnd') ).format("L") ;
	};
}
