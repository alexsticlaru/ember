import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { observer, computed } from '@ember/object';
import { on } from '@ember/object/evented';
import config from 'civ/config/environment' ;

const { APP: { USER } } = config ;

/**
 * This service is intended to centralize the debug outputs
 *
 * This is mainly for some debug messages to keep in the production code but with no effect on normal users.
 * The intention is mainly to quicken debugging when it is temporarily needed or for crucial events and to provide a verbose mode on production not impacting users.
 *
 * One major advantage of the debug service (usually used in the "dbgS" remapped name) is that you can turn it verbose mode on or off adding a "&debugmode=1" or "&debugmode=0" in the query, regardless of your current user's rights and regardless of the ENV running Ember (local, preprod, prod : all the same).
 *
 * Includes console log/warn/error messages but also alert(), confirm(), prompt() bindings that will not pop on normal users (simple ones or community admins)
 *
 * For simple code developing the console.log/warn/error keep being options at your convenience.
 *
 */
export default Service.extend({
	cookies: service(),
	toast: service() ,
	userService: service('user'),
	_force_debugger:null,
	_force_v7StringsReport: null,
	_showEachAdaptersRequest:false,
	_dontShowBubbles:false,
	_dontPollNotifications:false,
	/**/
	_testMonheimPass:false,
	/**/
	debug_showEachAdaptersRequest: alias('_showEachAdaptersRequest'),
	infinityEnded:false,

	initServices: on('init', function () {
// 		this.get('userService');
		this.set('_force_debugger', this.get('cookies').read('debug'));
		this.set('_force_v7StringsReport', this.get('cookies').read('v7stringsreport'));
// alert( "_force_debugger "+this.get('_force_debugger') );
		this.set('_showEachAdaptersRequest', this.get('cookies').read('debug_showEachAdaptersRequest'));
		if( this.get('_force_debugger') && this.get('cookies').read('debug_dontPollNotifications')===undefined )
			this.set('_dontPollNotifications', true);//default if no cookie and user is a debugger
		else this.set('_dontPollNotifications', this.get('cookies').read('debug_dontPollNotifications'));
		this.set('_dontShowBubbles', this.get('cookies').read('debug_dontShowBubbles'));
		/*Temp:*/
		this.set('_testMonheimPass', this.get('cookies').read('test_MonheimPass'));
		/**/
		if( this.get('_force_debugger')==="0" )this.set('_force_debugger', false);
		if( this.get('_showEachAdaptersRequest')==="0" )this.set('_showEachAdaptersRequest', false);
		if( this.get('_dontShowBubbles')==="0" )this.set('_dontShowBubbles', false);
		if( this.get('_dontPollNotifications')==="0" )this.set('_dontPollNotifications', false);
		/**/
this.notify( 'service debug inited - config.environment:'+config.environment+" - _force_debugger:"+this.get('_force_debugger')+" -  _force_v7StringsReport :"+this.get('_force_v7StringsReport ')+" -_showEachAdaptersRequest:"+this.get('_showEachAdaptersRequest')+" - _dontPollNotifications:"+this.get('_dontPollNotifications')+" - _dontShowBubbles:"+this.get('_showEachAdaptersRequest') );
	}),

	forceDebugMode(bool){
		//automatically called in application route beforeModel if query var ?debugmode=X
console.error('forceDebugMode('+bool+') - config.environment:'+config.environment);
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('debug', bool, {path:'/', expires:date});
		this.set('_force_debugger',bool);
	},

	forceV7StringsReport(bool){
		//automatically called in application route beforeModel if query var ?v7stringsreport=X
console.error('forceV7StringsReport('+bool+') - config.environment:'+config.environment);
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('v7stringsreport', bool, {path:'/', expires:date});
		this.set('_force_v7StringsReport',bool);
	},

	forceDebugShowEachAdaptersRequest(bool){
		//automatically called in application route beforeModel if ?debug_showEachAdaptersRequest=X
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('debug_showEachAdaptersRequest', bool, {path:'/', expires:date});
		this.set('_showEachAdaptersRequest',bool);
	},

	forceDontPollNotifications(bool){
		//The notifications and current user datas are triggered by interval (application route), leading to more log - for debuging we may don't want this - set by query ?debug_forceDontPollNotifications=1|0
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('debug_dontPollNotifications', bool, {path:'/', expires:date});
		this.set('_dontPollNotifications',bool);
	},

	forceDebugDontShowBubbles(bool){
		//automatically called in application route beforeModel if ?debug_dontShowBubbles=X
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('debug_dontShowBubbles', bool, {path:'/', expires:date});
		this.set('_dontShowBubbles',bool);
	},

	forceTestMonheimPass(bool){
		//automatically called in application route beforeModel if ?debug_dontShowBubbles=X
		let date=new Date();
		date.setMonth( date.getMonth()+1 );
		this.get('cookies').write('test_MonheimPass', bool, {path:'/', expires:date});
		this.set('_testMonheimPass',bool);
	},

	/**/
	@computed('userService.isGlobalAdmin', '_force_debugger')
	get isDebugger(){
		if( this.get('_force_debugger')!==null ){
			return (this.get('_force_debugger')==1);
		}
		/* Stop spamming the developers : now the ?debugmode=1 must be passed to enable dbgmode
		if( config.environment !== 'production' || this.get('userService.isGlobalAdmin') ){
			return true;
		}
		*/
		return false;
	},

	/**/
	@computed('_force_v7StringsReport')
	get isV7StringsReporter(){
		if( this.get('_force_v7StringsReport')!==null ){
			return (this.get('_force_v7StringsReport')==1);
		}
		return false;
	},


	/*!@@method notify(showBubble[, multiple arguments])
	 * @@descript:
	 * notify() should be used for normal debug messages ! It should use console.log() but may user console.error() just to make the reports more visible.
	 * the only other methods that should be used are error(), alert() and confirm()
	 * error() is then reserved for reel errors that we catch for debugging
	 * @@arguments:
	 *  @showBubble <boolean> : if true and the _dontShowBubbles flag is not true, an error bubble will be shown on the page through toast. Set this carefully to avoid too much bubbles...
	 *  @multiple_arguments : as for console.error() etc, an indefinite length of arguments is possible, combining strings and objects or arrays to introspect.
	 * If first argument is not boolean, showBubble will be set at false
	 *
	 */
	notify(){
		if( this.get('isDebugger') ){
			var showBubble = arguments[0];
			let args = arguments;
			if( (typeof args)==='object' ){
				let tp = new Array();
				for(let d in args){
					if( !isNaN(d) && (d > 0 || (args[d]!==true && args[d]!==false)) ){
						if( d==0 && args[d]!==true && args[d]!==false )
							showBubble=false;
						tp[tp.length]=args[d];
					}
				}
				args=tp;
			}else if( showBubble===true || showBubble===false )
			 args.shift();//we remove our or own first argument : <boolean> showBubble
			else showBubble=false;
			if( showBubble && !this.get('_dontShowBubbles') ){
				let args2 = Array.prototype.slice.call(args);
				args2 = args.join('<br>');
				this.get('toast').error( 'Debugger notify<br>'+args2 ) ;
			}
			args[0] = "debug notify :"+args[0];
			console.error(...args);
		}
	},

	/*To activate for route debugging (tracking models loading) ::*/
	notifyBeforeModel(callerLabel){
		//this.notify("notifyBeforeModel("+callerLabel+");");
	},
	notifyModel(callerLabel){
		//this.notify("notifyModel("+callerLabel+");");
	},
	notifyAfterModel(callerLabel){
		//this.notify("notifyAfterModel("+callerLabel+");");
	},
	/*:: To activate for route debugging (models loading)*/

	errorBubble(){
		if( this.get('isDebugger') )
			this.get('toast').error( ...arguments ) ;
	},

	successBubble(){
		if( this.get('isDebugger') )
			this.get('toast').success( ...arguments ) ;
	},

	warningBubble(){
		if( this.get('isDebugger') )
			this.get('toast').warning( ...arguments ) ;
	},

	log(){
		if( this.get('isDebugger') ){
			/*let args = Array.prototype.slice.call(arguments);
			args = args.join('<br>');
			this.get('toast').error( 'Debugger log<br>'+args ) ;*/
			arguments[0] = "debug log :"+arguments[0];
			console.log(...arguments);
		}
	},

	error( ){
		if( this.get('isDebugger') ){
			arguments[0] = "debug error :"+arguments[0];
			console.error(...arguments);
		}
	},

	warn(){
		if( this.get('isDebugger') ){
			arguments[0] = "debug warn :"+arguments[0];
			console.warn(...arguments);
		}
	},

	alert(){
		if( this.get('isDebugger') ){
			arguments[0] = "debug alert :"+arguments[0];
			this.notify(false, ...arguments);
			alert( ...arguments );
		}
	},

	confirm(){
		if( this.get('isDebugger') ){
			arguments[0] = "debug confirm :"+arguments[0];
			this.notify(false, ...arguments);
			return confirm( ...arguments );
		}
		return null;
	},

});
