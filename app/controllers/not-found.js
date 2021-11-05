import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { on } from '@ember/object/evented';

export default Controller.extend({
	intl: service(),
	popupService: service('popup'),

	metaFields: function () {
		return {
			title: this.get('intl').t('notFound.title') + ' - Civocracy',
			description: this.get('intl').t('notFound.title') + ' - Civocracy',
			image: "https://res.cloudinary.com/civocracy/image/upload/w_600,h_315,c_fill,q_auto,f_auto,g_auto/l_civ,w_80,g_north_east/v1473327429/static/home4.jpg"
		};
	},

	initServices: on('init', function () {
		this.get('intl') ;
		this.notifyPropertyChange('intl.locale') ;
	})
});
