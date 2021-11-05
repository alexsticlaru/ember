//Not used right now on pr1 (why?? it should be https://github.com/rwjblue/ember-cli-content-security-policy) anyway we transfer the config in config/environment

/*
module.exports = function(environment) {
  return {
    delivery: ['header'],
//     enabled: environment === 'production' || environment === 'preproduction' || environment === 'local',
	enabled: true,
    failTests: true,
    policy: {
		'default-src':	["'self' http://10.0.2.2:4200 static.olark.com *"],
		'frame-src':	["'self' static.olark.com *"],
		'worker-src': 	["'self' http://10.0.2.2:4200/ s-static.ak.facebook.com static.ak.facebook.com www.facebook.com accounts.google.com static.olark.com api.typeform.com *"],
		'script-src':	["'unsafe-inline' http://10.0.2.2:4200 http://10.0.2.2:7020 cdn.ravenjs.com https://assets.zendesk.com https://civocracy.zendesk.com https://*.zopim.com wss://*.zopim.com https://*.zopim.io cdn.inspectlet.com use.typekit.net cdnjs.cloudflare.com api.typeform.com civocracy.typeform.com *.typeform.com apis.google.com www.googleapis.com connect.facebook.net maps.googleapis.com maps.gstatic.com"],
		'font-src':   	["'self' data: use.typekit.net fonts.gstatic.com www.inspectlet.com https://*.zopim.com"],
		'connect-src':	["'self' admin.civocracy.local beta-back.civocracy.org admin.civocracy.org civocracy.typeform.com *.typeform.com *.zopim.com *"],
		'img-src':      ["'self' data: blob: *"],
		'media-src':	["'self' static.olark.com"],
		'style-src':	["'self' 'unsafe-inline' cdnjs.cloudflare.com static.olark.com use.typekit.net https://fonts.googleapis.com static.olark.com www.gstatic.com api.typeform.com civocracy.typeform.com *.typeform.com"],
		'form-action':	["'self' *"],
		'child-src':	["'self' *"],
    },
    reportOnly: false
  };
};
*/
