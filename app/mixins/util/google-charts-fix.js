import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

export default Mixin.create({

	googleChartsLoaded : false,

	/**
	 * workaround for a bug in the ember-google-charts add-on which is not able to load the Google Charts library anymore
	 * will load it manually here
	 *
	 * https://gitlab.com/civocracy/roadmap/issues/28
	 * https://github.com/sir-dunxalot/ember-google-charts/pull/56
	 * https://github.com/sir-dunxalot/ember-google-charts/pull/56/commits/b687e69506eec5333292fc1b575a8ddb5e3d7c33
	 *
	 * @returns {RSVP.Promise}
	 */
	loadGoogleChartsFix: function () {
		const googlePackages = ['corechart', 'bar', 'line', 'scatter'];
		const language = 'en';
		const {google: {charts}} = window;

		return new RSVP.Promise((resolve, reject) => {

			if (this.get('googleChartsLoaded')) {
				resolve();
			}

			charts.load('current', {
				language: language,
				packages: googlePackages,
			});
			charts.setOnLoadCallback((ex) => {
				if (ex) {
					reject(ex);
				}
				this.set('googleChartsLoaded', true);
				resolve();
			});
		});
	},
});
