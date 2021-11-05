import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { computed, observer } from '@ember/object';
import { on } from '@ember/object/evented';
import BaseConsumer from 'ember-error-handler/consumer/base-consumer';
import config from 'civ/config/environment' ;
import RSVP from 'rsvp';

export default BaseConsumer.extend({
// 	@service ajax,
/*
	@service intl,
	@service toast,
	@service('user') userService,
	@service('debug') dbgS,
*/
	store: service(),
	ajax: service(),
	intl: service(),
	toast: service(),
	userService:  service('user'),
	dbgS: service('debug'),
	errorEmberListener: service('error-ember-listener'),

	application_route:null,
	is_sendingReport:false,

	havePreviousRouteReopened: false,//this is to detect if backend is not available
	bsodIsRendered: false,
	//descriptors: computed(() => []),
	descriptors: [],
	component : null,

	_errorReportsSent:0,
	_errorReportsSentMax:6,

	url_prev: null,
	url_cur: null,

	urlObs: observer('document', function() {
		if( this.url_cur === document.location.toString() )return;
		this.set('url_prev', this.url_cur );
		this.set('url_cur',document.location.toString());
	}),

    init() {
		this._super(...arguments);
		this.set('component','ember-error-handler/wsod-screen-'+config.environment);
		this.set('url_cur',document.location.toString());
		//console.log("document.location:", document.location);
		this.set('url_prev',document.referrer);
		//console.log("document.referrer:", document.referrer);
    },

	_descriptorNormalize(descriptor, message, file, line, column){
		//if descriptor is an array or string or object with no get() method, we ensure here the consume() method will not bug out...
		if(descriptor.isNormalized)
			return descriptor;
		if(descriptor.error && descriptor.error.isNormalized)
			return descriptor.error;
//  		console.log('_descriptorNormalize A :', descriptor, '\n, message=', message, '\n, file=', file, '\n, line=', line, '\n, column=', column);
		let d2 = {
			source:'N/A Unknown',
			isError:true,
			plainText:'',
			error:{
				message:'',
				stack:''
			},
			/*
			 *	get:function(prop){return eval('this.'+prop+';');},
			 *	set:function(prop, value){
			 *		console.log('SET this.'+prop+' = "'+value+'";');
			 	//eval('this.'+prop+' = "'+value+'";');
				this[prop] = value;
		}
		*/
		};
 		if( typeof descriptor === "string" ){
			//For Ember 3 this is a send action bubbling normally, not an error (to be confirmed and mitigated if needed).
			d2.error.message = descriptor;
			d2.isError = false;
		}else{
			let elType = (typeof descriptor).toLowerCase();
			if( elType === "object" || descriptor.length!==undefined ){//object or array
				Object.entries(descriptor).forEach(([i, v]) => {
// 					console.log('_descriptorNormalize A - d2.'+i+'=', v);
						d2[i] = v;
				});
				if(descriptor.message)
					d2.error.message = descriptor.message;
				if(descriptor.stack)
					d2.error.stack = descriptor.stack;
			}else if( (typeof descriptor).toLowerCase()==='string' ){//error string
				d2.error.stack = descriptor;
			}
		}
		/*}else{
	console.log('_descriptorNormalize B');
			d2 = descriptor;
			d2.error = descriptor;
		}*/
		d2.isNormalized = true;
// 		console.log('_descriptorNormalize A(', descriptor, '\n, message=', message, '\n, file=', file, '\n, line=', line, '\n, column=', column, ')\nd2=', d2)
		return d2;
	},

    consume (descriptor) {
// this.dbgS.error("service ember-error-consumer CONSUME descriptor=", descriptor);
		if(!descriptor.isNormalized)
			descriptor = this._descriptorNormalize(descriptor);
		//let errorMessage = descriptor;
		let errorMessage = "",
			fatal = false;//set to true and reported to the backend as so when the BSOD has been displayed => should send an immediate mail notification to debuggers !
		const isEarlyCatch = descriptor.earlyCatch;//special case to handle backend not responding to initial model store.query and display the maintenance page
// console.log("consume(", descriptor, ")");
		if( descriptor ){
			if( descriptor.message ){
				errorMessage = descriptor.message;
			}else if( descriptor.error.message ){
				errorMessage = descriptor.error.message;
			}
			if( descriptor.errors ){
				//errors list
				let errors = Array.from(descriptor.errors);
				errors.forEach( (item, idx) => {
					errorMessage += '\nerror['+idx+']:'+
					( (item.title!==undefined) ? '\n&nbsp;&nbsp;title:&nbsp;'+item.title : '' )+
					( (item.detail!==undefined) ? '\n&nbsp;&nbsp;detail:&nbsp;'+item.detail : '' )+
					( (item.status!==undefined) ? '\n&nbsp;&nbsp;status:&nbsp;'+item.status : '' )+
	// 					not interesting : ( (item.detail!==undefined) ? '\n detail:'+item.detail : '' )+
						'\n';
				});
			}
		}
		if(this.dbgS.isDebugger)//for normal users we still show the bubble (search for errorBubble below in the code) for strong errors as it helps us to find and fix bugs when they report them - for debuggers we show the bubble for any erros, early in the method
			this.dbgS.errorBubble(errorMessage, "Error");
		this.dbgS.notify(true, "Consuming error - havePreviousRouteReopened : "+this.get( 'havePreviousRouteReopened')+"\nmessage(s)="+ errorMessage +"\ndescriptor=", descriptor);
		const retB = true;//set to true to let the original error pop in the console, to false for not
		if( this.is_sendingReport ){
			this.dbgS.error(
				"Redondance! - service error-console-consumer -\n",
				"source:", descriptor.source,
				" -\nerror string:", descriptor.isError ? descriptor.plainText : descriptor.error
			);
			return retB;
		}
		this.set('is_sendingReport',true);
		const descriptors = this.descriptors;
		this.descriptors.pushObject(descriptor);
		/*Skipping errors >>>>*/
		let skipErrorSending = false;//pass it to true to not send the report through backend
		if( descriptor.error ){
			if( descriptor.error && errorMessage && errorMessage.indexOf('The adapter operation was aborted')>=0){
				return retB;/*This is a too much generic error that can happen after a big bug (and this bug should be consumed before then we don't need to catch it here) or it can be a refresh from the browser at a bad moment for Ember and it should not be reported also*/
			}
			if( descriptor.error && descriptor.error.consoleMessage && descriptor.error.consoleMessage.indexOf('back-end error')<0){
				return retB;/*Here we dont report the authentication errors except if the string "back-end error" is present. Any other error is just a failed authentication handled normally (not exception)*/
			}
			if( errorMessage && errorMessage.indexOf('User canceled authorization')>=0 && errorMessage.indexOf('Facebook Auth BUG !') < 0 ){//OAuth2 - Facebook
				skipErrorSending = true;
				descriptor.set('error.message', 'Facebook user canceled auth ! Authentication failed.');
			}
			if( errorMessage && errorMessage.indexOf('not received before the window closed') >= 0){
				return retB;/*This is a Torii error that can be related to the user closing the Keycloak popup window or that can be a real KC error => we actually skip them but if any problem : unskip it*/
			}
			if( errorMessage && errorMessage.indexOf('TransitionAborted') >= 0){//a lot of "normal" errors of this kind can happen => no report
				return retB;
			}
		}
		/*<<<< Skipping errors*/
		this.set( 'havePreviousRouteReopened', ((descriptor.source==='ember-ApplicationRoute.reopen') || isEarlyCatch) );

		//Detecting if a backend problem is the reason of this error and if one test is true display the BSOD (maintenance message for production, error display for development and local envs)
// console.log("errorMessage=", errorMessage);

		const //err1 = (descriptor.source==="ember-route" && descriptor.isError && descriptor.plainText.indexOf('hash.error')>=0 && errorMessage.indexOf('The adapter operation was aborted')>=0),
			//while contentLoading = true the page is not rendered, meaning any BE error will result in hanging loading anim
			err1 = document.contentLoading,//any error when ember is loading/rendering the initial content will anyway stop any further execution !
			err2 = (this.get( 'havePreviousRouteReopened') || document.contentLoading) && (errorMessage && errorMessage.indexOf('The backend responded with an error')>=0),
			err3 = (errorMessage && errorMessage.indexOf('The adapter operation was aborted')>=0 );

// this.dbgS.error("service ember-error-consumer consume()\nerr1=", err1, "\n- err2=", err2, "\n- err3=", err3, "\nerrorMessage=", errorMessage);

		if( err1 || err2 || err3 ){//backend is off at website init
			//Rendering template to issue a maintenance page
			//this section may not be reliable... see bellow for backend failure screen display
			fatal = true;
			if (!this.bsodIsRendered) {
				setTimeout(function(){window.location.reload();}, 60000);//we reload automaticaly the page every 60secs
				let lookupKey;
				const owner = getOwner(this);
				lookupKey = 'component:' + this.component;
				const component = owner.lookup(lookupKey);
				if (!component) {
					throw Error(`Cannot instantiate wsod component '${lookupKey}'`);
				}
				lookupKey = 'template:components/' + this.component;
				const layout = owner.lookup(lookupKey);
/*
console.log("lookupKey:", lookupKey);
console.log("layout:", layout);
console.log("component:", component);
console.log("component.layout:", component.layout);
*/
				component.set('descriptors', descriptors);
				//component.set('message', errorMessage.replace(/\n/g, "<br>\n"));
				component.set('debugMessage', errorMessage.replace(/\n/g, "<br>\n"));
// 				component.set('debugMessage', descriptor.error.stack);
				if (layout) {
					component.set('layout', layout);
				}
				component.append();
				this.set('bsodIsRendered', true);
			}

		}else if( err2 ){
/*TODO
 * Here we want to redirect to previous route if available (this needs implementing user service or a new application service to store the previous route and for this the route files will have to register the current route to the service).
 * + an error will be displayed in the bubble : "Oups something went wrong..."
*/
//this.get('application_route').redirectToPreviousPage("Oups something went wrong");

		}

		//if( config.environment !== 'production' )
		if( false && this.dbgS.isDebugger ){//unactivated! ember-error-listener already sends the error in the console
			//Issuing console log in dev environment
			// eslint-disable-next-line no-console
			this.dbgS.error(
				"service error-console-consumer -\n",
				"source:", descriptor.source,
				" -\nerror string:", descriptor.isError ? descriptor.plainText : descriptor.error
			);

			const additionalData = descriptor.additionalData;
			if (additionalData) {
				// eslint-disable-next-line no-console
				this.dbgS.warn('Additional data', additionalData);
			}
		}

		if(!this.dbgS.isDebugger && !skipErrorSending){//for normal users we still show the bubble for strong errors as it helps us to find and fix bugs when they report them - for debuggers we show the bubble for any erros, early in the method
			this.get('toast').error(errorMessage, "Error") ;
		}
		//Sending query to backend to register the bug :
		if( !skipErrorSending && this._errorReportsSent <= this._errorReportsSentMax && ( true || config.environment !== 'production' ) ){//we are sending, even in production !
			this.set('_errorReportsSent', this._errorReportsSent + 1  );
			const _this = this;
/*
this.dbgS.notify("descriptor.isError:", descriptor.isError);
this.dbgS.notify("descriptor.plainText:", descriptor.plainText);
this.dbgS.notify("descriptor.error.message:", descriptor.error.message);
this.dbgS.notify("descriptor.error.stack:", descriptor.error.stack);
this.dbgS.notify("descriptor.normalizedStack:", descriptor.normalizedStack);
this.dbgS.notify("descriptor.error.fileName:", descriptor.error.fileName);
this.dbgS.notify("descriptor.normalizedMessage:", descriptor.normalizedMessage);
this.dbgS.notify("descriptor.normalizedName:", descriptor.normalizedName);
*/
			const _iserror = descriptor.isError;
			/*let errorString = descriptor.plainText ?
								descriptor.plainText
								: ( (descriptor.error && descriptor.error.message ) ?
									descriptor.error.message
									: ( descriptor.normalizedMessage ?
											descriptor.normalizedMessage
											: ''
									)
								);
			if( !errorString )
				errorString = descriptor.normalizedName ? descriptor.normalizedName : 'N/A Unknown'
			*/
			const errorString = errorMessage;
			let stack = ( ( descriptor.error && !(!descriptor.error.stack) ) ?
									descriptor.error.stack
									: (!(!descriptor.normalizedStack) ?
										descriptor.normalizedStack
										: 'N/A'
									)
						);
			let fileName = ( ( descriptor.error && !(!descriptor.error.fileName) ) ?
									descriptor.error.fileName
									: descriptor.fileName );
			const lineNumber = ( ( descriptor.error && !(!descriptor.error.lineNumber) ) ?
									descriptor.error.lineNumber
									: descriptor.lineNumber );
			const columnNumber =  ( ( descriptor.error && !(!descriptor.error.columnNumber) ) ?
									descriptor.error.columnNumber
									: descriptor.columnNumber );
/** /
this.dbgS.notify("Sending errorString:", errorString);
this.dbgS.notify("Sending stack:", stack);
this.dbgS.notify("Sending fileName:", fileName);
this.dbgS.notify("Sending lineNumber:", lineNumber);
this.dbgS.notify("Sending columnNumber:", columnNumber);
/**/
			let errorReport = this.store.createRecord('frontend-error', {
				fatal: fatal,
				useragent: window.navigator.userAgent,
				url_prev: this.url_prev,
				url_cur: this.url_cur,
				locale: this.intl.locale,
				user: this.userService.currentUser,
				isDebugger: this.dbgS.isDebugger,
				source: descriptor.source,
				report: errorString,
				stack: stack,
				fileName: fileName,
				lineNumber: lineNumber,
				columnNumber: columnNumber,
			});
			errorReport.save().catch( error => {
				_this.dbgS.notify(true, "Error from backend when reporting error", error, "\n- havePreviousRouteReopened=", _this.havePreviousRouteReopened, "\n- bsodIsRendered=", _this.bsodIsRendered, "\n", ( _this.havePreviousRouteReopened && !_this.bsodIsRendered));

				if ( _this.havePreviousRouteReopened && !_this.bsodIsRendered) {
					//The backend is off or has a major problem : after a first "ApplicationRoute.reopen" the report query also failed => backend is not responding
					setTimeout(function(){window.location.reload();}, 60000);//we reload automaticaly the page every 60secs
					fatal = true;//! anyway we can't report to the backend as it fails for that too... -- we should have message on the BSOD asking the user to report by mail to support@civocracy.org - or not...
					let lookupKey;
					const owner = getOwner(_this);
					lookupKey = 'component:' + _this.component;
					const component = owner.lookup(lookupKey);
					if (!component) {
						throw Error(`Cannot instantiate wsod component '${lookupKey}'`);
					}
					lookupKey = 'template:components/' + _this.component;
					const layout = owner.lookup(lookupKey);
					component.set('descriptors', descriptors);
					component.set('debugMessage', errorMessage.replace(/\n/g, "<br>\n"));
// 						component.set('message', errorMessage.replace(/\n/g, "<br>\n"));
// 						component.set('debugMessage', descriptor.error.stack);
					if (layout)
						component.set('layout', layout);
					component.append();
					_this.set('bsodIsRendered', true);
				}
				return retB;
			});

		}else this.dbgS.error('NOT SENDING REPORT!');
		this.set('is_sendingReport',false);

        return retB;
	},

	'component-preproduction': computed(function () {
		this.dbgS.error('error-console-consumer.js component-development');
		let component = this.config['wsod-component-development'];
		if (!component) {
		component = 'ember-error-handler/wsod-screen-development';
		}
		return component;
	}),

	'component-development': computed(function () {
		this.dbgS.error('error-console-consumer.js component-development');
		let component = this.config['wsod-component-development'];
		if (!component) {
		component = 'ember-error-handler/wsod-screen-development';
		}
		return component;
	}),

	'component-production': computed(function () {
		this.dbgS.error('error-console-consumer.js component-production');
		let component = this.config['wsod-component-production'];
		if (!component) {
			component = 'ember-error-handler/wsod-screen-production';
		}
		return component;

	}),

	component: computed(function () {
		this.dbgS.error('error-console-consumer.js component');
		let component = this.config['wsod-component'];
		if (!component) {
			const env = this.environment;
			component = this.get('component-' + env);
		}
		return component;
	}),

});
