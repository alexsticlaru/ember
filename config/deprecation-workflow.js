if( !(!window.deprecationWorkflow) )
	window.deprecationWorkflow = window.deprecationWorkflow || {};
else window.deprecationWorkflow = {};

/* In JS console, run : deprecationWorkflow.flushDeprecations() to get a list of deprecations (to skip here eventually)
 * https://guides.emberjs.com/release/configuring-ember/handling-deprecations/
 * https://api.emberjs.com/ember/release/functions/@ember%2Fdebug/registerDeprecationHandler
 *
 */

window.deprecationWorkflow.config = {
	workflow: [

		/* Culprit: ember-froala-editor (needs update). */
		{ handler: "silence", matchId: "ember-string-ishtmlsafe-polyfill.import" },

		/* Culprit: ? */
		{ handler: "warn", matchId: "ember-views.render-double-modify" },
		{ handler: "warn", matchId: "ember-application.validate-type" },
		{ handler: "silence", matchId: "ember-metal.ember-k" },
		{ handler: "silence", matchId: "container-lookupFactory" },
		{ handler: "warn", matchId: "ds.defaultValue.complex-object" },

		/* Warn this to detect back-end inconsistency. */
		{ handler: "silence", matchId: "ds.serializer.rest.queryRecord-array-response" },

		{ handler: "silence", matchId: "ds.serializer.rest.queryRecord-array-response" },
		{ handler: "silence", matchId: "ember-click-outside.action-prop" },
		{ handler: "silence", matchId: "ember-click-outside.kebab-cased-props" },
		{ handler: "silence", matchId: "ember-froala-editor.defaultOptions" }

	]
} ;

