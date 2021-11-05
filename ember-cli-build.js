/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {

	const env = EmberApp.env();
	const enableTerser = ['production', 'preproduction'].indexOf(env) > -1;

	const app = new EmberApp(defaults, {
		'ember-cli-terser': {//minify for production
			enabled: enableTerser,
			exclude: [/*'assets/civ.js'*/],//excluded files for minification
			terser: {
			  compress: {
				sequences: 50,
			  },
			  output: {
				semicolons: true,
			  },
			},
		},
		autoImport: {
			forbidEval: enableTerser
		},

		'babel': {
			loose: true,
			plugins: [
				'transform-object-rest-spread'
			]
		},
		'hinting': false,
		"ember-drag-drop-polyfill": {
			includeCSS: true,
			includeIconsCss: false,
			includeDebugCss: true
		}
	}) ;

	// Use `app.import` to add additional libraries to the generated

	return app.toTree();
};
