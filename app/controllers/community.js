import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommunityController extends Controller {
  @service router;
  

	//Set the breadcrumb name to the community name:
	get breadCrumb() {
		return this.model.community.name;
	}

	
	/** model taken from civ6/app/controllers/community.js : to adapt ? anyway we need title and others metas to be tuned finely for each routes...
	* Fills <meta></meta> tag.
	* @method metaFields
	* /
	metaFields: computed('highlightedProposition', function () {
		const proposition = this.get('highlightedProposition');
		let title = this.get('community.name') + ' - Civocracy';
		let imageUrl = 'https://res.cloudinary.com/civocracy/image/upload/w_600,h_315,c_fill,q_auto,f_auto,g_auto/l_civ,w_80,g_north_east/';
		imageUrl =+ this.get('community.computedCover') + '.jpg';

		if ( proposition ) {
			const imageURLStart = 'https://res.cloudinary.com/civocracy/image/upload/w_600,h_315,c_fill,o_50,q_auto,f_auto,g_auto/w_500,c_fit,l_text:Arial_30:';
			const imageURLEnd = '/l_civ,w_80,g_north_east/' + this.get('community.computedCover') + '.jpg' ;
            title = proposition.get('title') + ' - Civocracy' ;
			imageUrl = imageURLStart + encodeURIComponent(proposition.get('title')) + imageURLEnd ;
		}

		return {
			title,
			description: this.get('i18n').t('home.header.title') + ' ' + this.get('i18n').t('home.header.subtitle') + ' ' + this.get('community.name') + '.',
			imageUrl
		}
	}),
	*/
}
