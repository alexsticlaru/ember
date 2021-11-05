'use strict';
/* eslint-env node */

module.exports = function (environment) {

	const ENV = {
		/*
		 * Ember globals.
		 */
		modulePrefix: 'civ',
		environment,
		rootURL: '/',
		locationType: 'auto',
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			},
			EXTEND_PROTOTYPES: {
				Array: true,
				// Prevent Ember Data from overriding Date.parse.
				Date: false,
				Function: true,
				String: true
			}
		},

		breakpoints: {
			phone: 600,
			tabPort: 900,
			tabLand: 1200,
			bigDesktop: 1440
		},

		moment: {
			// Options:
			// 'all' - all years, all timezones
			// 'subset' - subset of the timezone data to cover 2010-2020 (or 2012-2022 as of 0.5.12). all timezones.
			// 'none' - no data, just timezone API
			includeTimezone: 'all',
			//! ENV.moment.includeLocales is used by our intl service as the supported languages. 'blank' and 'placeholders' are special non language related to the translator tools and are defaulting on 'en' for moment setup
			includeLocales: [/*'blank', 'placeholders', */'en', 'es', 'de', 'fr', 'nl', 'hr', 'it', 'ca']
		},

		intl: {
			includeLocales: ['blank', 'placeholders', 'en', 'es', 'de', 'fr', 'nl', 'hr', 'it', 'ca']
		},

		"ember-drag-drop-polyfill": {
			// These options are passed through to mobile-drag-drop
			mobileDragDrop: {
				enableEnterLeave: true,
				holdToDrag: 100 // Hold for 500ms until drag starts
			},
			// These options are used by ember-drag-drop-polyfill
			customOptions: {
				enableIOSHack: true, // Enable if targeting iOS Safari 10.x and higher, see https://github.com/timruffles/mobile-drag-drop/issues/77
				includeScrollBehavior: true // Sets the 'dragImageTranslateOverride' option in mobile-drag-drop
			}
		},

		/*
		 * App configuration.
		 */
		APP: {
			API_HOST: 'https://admin.civocracy.org',

			API_KEYS: {
// 				"facebook-oauth2-bearer": {//! WATCH OUT this is not the id/secret placeholder that will be used for authentication ! See "torii" below !
// 					//id:     "394690194056710",
// 					//secret: "007399948a5010c08a3cb8c2a26c8cc6"
// 					id:     "403353520301479",
// 					secret: "3bf97967ef4efa1371318609c67a974c"
// 				},
				facebookAppId: "403353520301479",

/* Monheim is no more a customer
				"keycloakmonheim-oauth2-bearer": {//! WATCH OUT this is not the id/secret placeholder that will be used for authentication ! See "torii" below !
					//id:     "394690194056710",
					//secret: "007399948a5010c08a3cb8c2a26c8cc6"
					id:     "civocracy",
					secret: "76744ebf-24d9-4224-a35d-7600b34972ac"
				},
*/

				"civocracy-oauth2": {
					id:     "1_3qn8lacme44kwwg0g84g00gowkgssc8o44go88ko4w8w0wk448",
					secret: "80cwgwsc8k8w0k8sks416eqpwofy5dwo4wggk4s40s80sgcs4g"
				},
				"google-translate": {
					id: "AIzaSyBr_Q88tD0lfiAMb867aDigkMqCSTyrwO0"
				}
			},

			// Time expiry margin before which token refresh should be triggered
			// Format: http://momentjs.com/docs/#/manipulating/add/
			OAUTH_TOKEN_EXPIRY_MARGIN: {
				value: 1,
				unit: 'hours'
			},

			// Directory of locality ids, per customer.
			CUSTOMERS: {
				VILLEDELYON: "4910",
				FRIENDS_OF_EUROPE: [
					"8584",
					"8916",
					"8917",
					"8918",
					"8919",
					"8920",
					"8921",
					"29443"
				]
			},
		},

		/*
		 * Torii: authentication addon.
		 */
		torii: {
			sessionServiceName: 'torii-session',
			allowUnsafeRedirect: true,
			providers: {
				'facebook-oauth2': {
					// old one, not handling domains of AURO and FoE
					//apiKey:     "394690194056710",
					//secret:     "007399948a5010c08a3cb8c2a26c8cc6",
					apiKey:     "403353520301479",
					secret: "3bf97967ef4efa1371318609c67a974c",
					scope:  'email,public_profile',
					//production redirect
					redirectUri: 'https://new.civocracy.org/torii/redirect.html' // default is /torii/redirect.html
				}

			}
		},

		/*
		 * Toastr: bubble feedback addon.
		 */
		"ember-toastr": {
			toastrOptions: {
				closeButton: true,
				debug: false,
				newestOnTop: true,
				progressBar: false,
				positionClass: 'toast-top-right',
				preventDuplicates: true,
				onclick: null,
				timeOut: '5000',
				extendedTimeOut: '5000',
				showDuration: '300',
				hideDuration: '1000',
				showEasing: 'swing',
				hideEasing: 'linear',
				showMethod: 'fadeIn',
				hideMethod: 'fadeOut'
			}
		},

		'ember-d3': {
			only: ['d3-selection', 'd3-geo', 'd3-array']
		},

		/*
		 * Cloudinary: images hosting addon.
		 */
		cloudinary: {
			cloudName: 'civocracy',
			api_key: '175551475299895',
			secure: true
		},


		/*
		 * Cross-domain Security Policy.
		 */
		//https://github.com/ZebraFlesh/ember-cli-content-security-policy
		//Use with care ! : contentSecurityPolicyHeader: 'Content-Security-Policy',
		contentSecurityPolicyHeader: 'Content-Security-Policy', //'Content-Security-Policy-Report-Only',
		contentSecurityPolicy: {
				'default-src':	["'self' http://10.0.2.2:4200 www.civocracy.local:4200 www.civocracy.local:4201 static.olark.com *"],
				'frame-src':	["'self' static.olark.com *"],
				'worker-src': 	["'self' http://10.0.2.2:4200/ www.civocracy.local:4200 www.civocracy.local:4201 s-static.ak.facebook.com static.ak.facebook.com www.facebook.com accounts.google.com static.olark.com api.typeform.com *"],
				//! we can't do without 'unsafe-inline' AND 'unsafe-eval' because Ember plugins at least are using injected code that is leading to hit the script-src if 'unsafe-inline' is not allowed... => we need to be careful to filter the contents we send in the back-end DB to avoid JS injection in contents...
				//! Or maybe it works in production ??
				'script-src':	["'self' 'unsafe-inline' 'unsafe-eval' http://10.0.2.2:4200 http://10.0.2.2:7020 www.civocracy.local:4200 www.civocracy.local:4201 cdn.ravenjs.com https://assets.zendesk.com https://civocracy.zendesk.com https://*.zopim.com wss://*.zopim.com https://*.zopim.io cdn.inspectlet.com use.typekit.net cdnjs.cloudflare.com api.typeform.com civocracy.typeform.com *.typeform.com apis.google.com www.googleapis.com connect.facebook.net maps.googleapis.com *.gstatic.com www.google.com"],
				'font-src':   	["'self' data: use.typekit.net fonts.gstatic.com www.inspectlet.com https://*.zopim.com"],
				'connect-src':	["'self' admin.civocracy.local beta-back.civocracy.org admin.civocracy.org civocracy.typeform.com *.typeform.com *.zopim.com *"],
				'img-src':      ["'self' data: blob: *"],
// 				'media-src':	["'self' static.olark.com"],	// Omit `media-src` from policy - Browser will fallback to default-src for media resources
				//! Again an issue... : ember-cli-content-security-policy is systematically adding a fake "nonce" that will disable some options like the unsafe-inline in 'style.src' but we need it !!
				//! => for now on local setup remove the nonce adds in node_modules/ember-cli-content-security-policy/index.js (only the lines using "appendSourceList(...)") or just disable the CSP for local env with ENV.contentSecurityPolicy = null;
				'style-src':	["'self' 'unsafe-inline' cdnjs.cloudflare.com static.olark.com use.typekit.net fonts.googleapis.com static.olark.com www.gstatic.com api.typeform.com civocracy.typeform.com *.typeform.com"],
				'form-action':	["'self' *"],
				'child-src':	["'self' *"],
		}

	};

	/*
	 * Environment-specific.
	 */

	if (environment === 'local') {
		//ENV.APP.API_HOST = 'http://localhost:8000';

// 		ENV.contentSecurityPolicy = null;

		ENV.APP.API_HOST = 'http://admin.civocracy.local:8000';
		//ENV.contentSecurityPolicyHeader = 'Content-Security-Policy';//test for local - will block the loading of CSP failing scripts, css and contents
		// ENV.torii.providers['facebook-oauth2-bearer'].redirectUri = "http://www.civocracy.local:4200/torii/redirect.html";
		//ENV.torii.providers['keycloak-oauth-implicit'].redirectUri = "http://www.civocracy.local:4200/torii/redirect.html";
		// ENV.torii.providers['keycloakmonheim-oauth2-bearer'].redirectUri = "http://www.civocracy.local:4200/torii/redirect.html";
		// ENV.torii.providers['keycloakmonheim-oauth2-bearer'].baseUrl = "https://qa.monheim-pass.de/auth/realms/buergerkonto/protocol/openid-connect/auth";
		// ENV.torii.providers['keycloakmonheim-oauth2-bearer'].secret = "76744ebf-24d9-4224-a35d-7600b34972ac";

/** /
		ENV.APP.LOG_RESOLVER = true;
		ENV.APP.LOG_ACTIVE_GENERATION = true;
		ENV.APP.LOG_TRANSITIONS = true;
		ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		ENV.APP.LOG_VIEW_LOOKUPS = true;

 		ENV.APP.LOG_BINDINGS = true;
 		ENV.RAISE_ON_DEPRECATION = true;
/**/

 		//ENV.LOG_STACKTRACE_ON_DEPRECATION = true;

		//https://npm.taobao.org/package/ember-error-logger

		ENV['ember-error-handler'] = {
			listeners: [
 				'service:error-ember-listener'
			],
			consumers: [
				'service:error-ember-consumer'
			]
		};


		/*???
		"ember-error-handler": {
			"wsod-component-production": 'my-own-component-for-wsod-screen-production'
			"wsod-component-development": 'my-own-component-for-wsod-screen-development'
			"wsod-component-": 'my-own-component-for-wsod-screen'
		}
		*/
	}


	if (environment === 'development') {
		ENV.contentSecurityPolicy = null;
		ENV.APP.API_HOST = 'https://beta-back.civocracy.org';
		ENV.APP.LOGIN_SYNC_HOST = 'https://beta.civocracy.org';
		ENV.torii.providers['facebook-oauth2'].redirectUri = "https://pr1.civocracy.org/torii/redirect.html";
		//ENV.APP.LOG_RESOLVER = true;
		//ENV.APP.LOG_ACTIVE_GENERATION = true;
		//ENV.APP.LOG_TRANSITIONS = true;
		//ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		//ENV.APP.LOG_VIEW_LOOKUPS = true;
 		//ENV.APP.LOG_BINDINGS = true;

 		ENV.RAISE_ON_DEPRECATION = false;
 		ENV.LOG_STACKTRACE_ON_DEPRECATION = false;

		ENV['ember-error-handler'] = {
			listeners: [
 				'service:error-ember-listener'
			],
			consumers: [
				'service:error-ember-consumer'
			]
		};
	}

	if (environment === 'test') {

		ENV.APP.API_HOST = 'https://beta-back.civocracy.org';
		//ENV.baseURL = '/';
		ENV.locationType = 'none';
		//ENV.APP.rootElement = '#ember-testing';
	}

   if (environment === 'preproduction') {//! This is the BETA server environment !
		//ENV.contentSecurityPolicy = null;
		ENV.APP.API_HOST = 'https://beta-back.civocracy.org';
		ENV.APP.LOGIN_SYNC_HOST = 'https://beta.civocracy.org';
		ENV.APP.V6_REDIRECT_HOST = 'https://beta.civocracy.org';

		ENV.torii.providers['facebook-oauth2'].redirectUri = "https://pr2.civocracy.org/torii/redirect.html";
		//ENV.APP.LOG_RESOLVER = true;
		//ENV.APP.LOG_ACTIVE_GENERATION = true;
		//ENV.APP.LOG_TRANSITIONS = true;
		//ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		//ENV.APP.LOG_VIEW_LOOKUPS = true;
		//ENV.APP.LOG_BINDINGS = true;
		ENV.RAISE_ON_DEPRECATION = false;
		ENV.LOG_STACKTRACE_ON_DEPRECATION = false;

/** /
		ENV.APP.LOG_RESOLVER = true;
		ENV.APP.LOG_ACTIVE_GENERATION = true;
		ENV.APP.LOG_TRANSITIONS = true;
		ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		ENV.APP.LOG_VIEW_LOOKUPS = true;

 		ENV.APP.LOG_BINDINGS = true;
 		ENV.RAISE_ON_DEPRECATION = true;
/**/

		ENV['ember-error-handler'] = {
			listeners: [
 				'service:error-ember-listener'
			],
			consumers: [
				'service:error-ember-consumer'
			]
		};
	}

	if (environment === 'production') {
		ENV.APP.LOGIN_SYNC_HOST = 'https://www.civocracy.org';
		ENV.APP.V6_REDIRECT_HOST = 'https://www.civocracy.org';

		ENV.torii.providers['facebook-oauth2'].redirectUri = 'https://new.civocracy.org/torii/redirect.html'

		//! VERY TEMPORARY :
		//ENV.contentSecurityPolicy = null;
		//! : VERY TEMPORARY

// 		ENV.contentSecurityPolicy = null;
// 		ENV.APP.LOG_RESOLVER = true;
// 		ENV.APP.LOG_ACTIVE_GENERATION = true;
// 		ENV.APP.LOG_TRANSITIONS = true;
// 		ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
// 		ENV.APP.LOG_VIEW_LOOKUPS = true;

		ENV['ember-error-handler'] = {
			listeners: [
 				'service:error-ember-listener'
			],
			consumers: [
				'service:error-ember-consumer'
			]
		};
	}

	return ENV;
};
