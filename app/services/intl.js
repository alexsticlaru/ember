//This service extends and replace the intl service
import _intl from 'ember-intl/services/intl';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/template';
import { later, cancel } from '@ember/runloop';
import config from 'civ/config/environment' ;
import Route from '@ember/routing/route';

//!We are using jquery selectors here as jquery is installed anyway (for addons ? other?)
// please note that a native replacement is available (integrated with ember/component) : https://deprecations.emberjs.com/v3.x/#toc_jquery-apis
import jQuery from 'jquery';

/*
TODO :
- implement the workflow for placeholders used when user is not connected (therefore when it doesn't  have translator rights) - typically login/signup flows => cookie spec + obligé de se loguer pour valider les translations

- settings pages : translators may not be admins and therefore would have no access to the setting pages => we need to give a quite-secured access to this pagesbut of course still forbiden any changes on the settings.

- for translators we get the current STATUS_VALIDATED translationStrings from the backend to show the translators what are the already translated placeholders waiting to be published

- finish/improve the popupTranslationsSummary or make it a whole page showing all the changes waiting to be published and with a button to publish them?

- handle the "accessibility" titles etc. that can't be correctly edited actually

- security (BE) : filter the translationString::value to forbid any injected code (JS/SQL etc.)
*/
export default _intl.extend({
	cookies: service(),
	store: service(),
	router: service(),
	toast: service() ,
	userService: service('user'),
	dbgS: service('debug'),

// 	@tracked _force_translatorMode: false,///@FIXME to implement (or not?) : the translators needs to be able to translate the  login popup : either use a cookie to force the translatormode (not much secured and plenty of issues to submit the new TranslationString objects) OR have a special feature to show the login popup when the translator mode is enabled by a logged in user.
	@tracked translatorToolActivated: false,

	// supportedLocales list the supported iso1 locales - if any locale change is using a non-listed label intl will fallback to the default 'en'
	// 'blank' is a special locale used for t() to display nothing while the needed locale is loading at the side - it is particularly used to rerender the translated texts in this case or others ones related to the translator tool
	// 'placeholders' is for translators/devs to see the placeholder's path instead of any translated strings
	//supportedLocales: ['blank', 'placeholders', 'en', 'es', 'de', 'fr', 'nl', 'hr'],

	//supportedLocales: config.moment.includeLocales,
	supportedLocales: config.intl.includeLocales,

	//languages is listing the shown locales for dropdown or any other user feature to change the locale => may contain less locales than supportedLocales for dev purposes
    @tracked languages : A([
        {name: 'Català', iso1:'ca', iso2: 'cat'},
        {name: 'Deutsch', iso1:'de', iso2: 'Ger'},
        {name: 'English', iso1: 'en', iso2:'Eng'},
        {name: 'Español', iso1:'es', iso2: 'Spa'},
        {name: 'Français', iso1: 'fr', iso2:'Fre'},
        {name: 'Hrvatski', iso1:'hr', iso2: 'hrv'},
        {name: 'Italiano', iso1:'it', iso2: 'Ita'},
        {name: 'Nederlands', iso1:'nl', iso2: 'Nld'},
	]),

	@tracked currentLanguage : {name: 'English', iso1:'en', iso2: 'Eng'},

	@computed("userService.currentUser", "locale")
	get translatableLanguages(){
		const transL = A([]);
		this.languages.forEach( language => {
			if( this.userService.get('isTranslator' + language.iso1.toUpperCase()) ){
				language.selectedClass = (this.locale.toString() === language.iso1.toString()) ? ' selected' : '' ;
				transL.pushObject(language);
			}
		});
		return transL;
	},

	@computed("userService.currentUser", "locale")
	get notTranslatableLanguages(){
		const transL = A([
			{name: 'Placeholders', iso1:'placeholders', iso2: 'Plh', selectedClass: (this.locale.toString() === "placeholders") ? ' selected' : ''}
		]);
		this.languages.forEach( language => {
			if( !this.userService.get('isTranslator' + language.iso1.toUpperCase()) ){
				language.selectedClass = (this.locale.toString() === language.iso1.toString()) ? ' selected' : '' ;
				transL.pushObject(language);
			}
		});
		return transL;
	},

	_inited: false,
	init() {
// 		this.set('_force_translatorMode', this.get('cookies').read('translatormode'));
		this._super(...arguments);
		let hasLocCookie = this.cookies.read('locale'), locale = this.locale;
		if( hasLocCookie && hasLocCookie !== 'blank' && this.supportedLocales.includes(hasLocCookie) ){
// this.dbgS.log('this.setLocale(this.validateLocale(', hasLocCookie, ') {'+this.validateLocale(hasLocCookie)+'});')
			this.setLocale( this.validateLocale(hasLocCookie) );
		}else{
			if( locale )
				locale = locale.toString();
			let locales = this.get('supportedLocales');
			if (navigator.language != null && locales.indexOf(navigator.language.substring(0, 2)) > -1) {
				locale = navigator.language.substring(0, 2);
			}
			if (navigator.userLanguage != null && locales.indexOf(navigator.userLanguage.substring(0, 2)) > -1) {
				locale = navigator.userLanguage.substring(0, 2);
			}
// this.dbgS.log('this.setLocale(this.validateLocale(', locale, ') {'+this.validateLocale(locale)+'});');
			this.setLocale(this.validateLocale(locale));
		}
		this._inited = true;
	},

	/*Check if a locale is supported, return the default one if not*/
	validateLocale(locale){
// this.dbgS.log('intl.validateLocale(', locale, ')');
/*
		if( typeof locale == "array" )
			locale = locale.shift();
*/
		locale = locale.toString();
		if( locale.toString() === "en-us" ){
// this.dbgS.log('intl.validateLocale(', locale, ') return "blank";');
			return 'blank';//SKIPPING ember intl default ! will be updated just after
		}
		if(this.supportedLocales.includes(locale)){
// this.dbgS.log('intl.validateLocale(', locale, ') return "'+locale+'";');
			return locale;
		}
// this.dbgS.log('intl.validateLocale(', locale, ') return "en";');
		return 'en';
	},

	_loadingLanguage: null,// the promise for this locale is not resolved
	_loadingLanguages: [],// stack of locales to be loaded, one by one
	_lLT_current: null,
	_lLT_loaded: ['blank', 'placeholders'],//this ones doesn't need to be loaded

	isLoading(locale){
		if( locale === 'blank' || locale === 'placeholders' || this._lLT_loaded.indexOf(locale) >= 0 )
			return false;//already loaded, ask isLoaded(locale)
		if( this._loadingLanguage === locale || this._loadingLanguages.indexOf(locale) >= 0 )
			return true;
		return false;
	},

	isLoaded(locale){
		if( locale === 'blank' || locale === 'placeholders' || this._lLT_loaded.indexOf(locale) >= 0 )
			return true;
		return false;
	},

	async loadLazyTranslations(locale, noAppLocaleChange, internCall){
		//see https://ember-intl.github.io/ember-intl/docs/guide/asynchronously-loading-translations
		//in case IE10 or other old browsers doesn't support that : we'll need to push further, using this tutorial as an example : https://simplabs.com/blog/2018/06/18/intl-polyfill-loading/
		if( /*!internCall &&*/ (this.isLoading(locale) || this.isLoaded(locale)) ){
			return true;
		}
		this._loadingLanguage = locale;
		if(this._loadingLanguages.indexOf(locale) < 0)
			this._loadingLanguages.push(locale);
		const translations = await fetch('/translations/'+locale+'.json');
		const translationsAsJson = await translations.json();
		this.addTranslations(locale, translationsAsJson);
		this._lLT_loaded.push(locale);
		this._loadingLanguage = null;
		/**/
		this._loadingLanguages.shift();//removing locale from currently loading languages => loaded
		/**/
		if( !noAppLocaleChange && this._loadingLanguage == locale && this.locale == locale ){//as we work async we check here that we don't have a more recent demand for another locale (that will be the one set)
			this._loadingLanguage = null;
		}else{
			this._loadingLanguage = null;
		}
		if( this._loadingLanguages.length > 0 ){
			this.loadLazyTranslations(this._loadingLanguages[0], noAppLocaleChange, true );
			locale = this.locale;
		}
		return false;
	},

	async _loadAllLocales(){
		// for translator tool only
		let len = this.supportedLocales.length,
			loc = this.locale;
		this.supportedLocales.forEach( (locale, index) => {
			//we let loadLazyTranslations load what is not already loaded
			this.loadLazyTranslations(locale, true).then(() => {
				if( this._lLT_loaded.length >= ( this.supportedLocales.length -2 ) ){
// 					this.dbgS.log("intl._loadAllLocales FINISHED!! " + index + "/" + (len-1) +" :: "+this._lLT_loaded.length+" >= "+( this.supportedLocales.length -2 ) );
					this.setLocale('blank', true, true);
					this.setLocale(loc, true);
				}
			});
		});
	},

	_setBodyClass_lastClass: null,
	_setBodyClass(){
		$('body').removeClass(this._setBodyClass_lastClass);
		$('body').addClass(this.locale);
		this._setBodyClass_lastClass = this.locale;
		//set locale for the lang attribute (See #348)
		$("html").attr("lang", this.locale);
		$('body').attr("lang", this.locale);
	},

	/* to set a specific locale call intl.setLocale("localeName");
	 * or call it without arguments to set the default locale chain
	 * ! TODO: add the complete chain and priorities (see also the code in init()) :
	 * ! 1) If "locale" cookie use it's value anyway (and if the user is logged in set it as the user's one in the backend if it's not)
	 * ! 2) If logged user use it's prefered language
	 * ! 3) otherwise use the browser's language
	 * ! 4) if multiple browser languages then see if there is a  matching CommunityService.currentCommunity.locale and use it
	 * ! 5) if all previous fail : use the first language from the browser
	 */
	setLocale(/* [locale[, noCookieSet[, noTranslationLoading]]] */){
		let locale = null;
		this.validateLocale(arguments[0]);
// this.dbgS.log('---\nintl.setLocale(this.validateLocale(', arguments[0], ') {'+this.validateLocale(arguments[0])+'});', trace());
		if( this.locale && this.locale.toString() === arguments[0].toString() ){
			//bypass: the local is already set - if at some point you need it to be reloaded, use intl.rerenderStrings()
// this.dbgS.log('intl.setLocale(): A bypass - this.locale=', this.locale);
			return;
		}
		if( arguments && arguments.length )
			locale = arguments[0].toString();
		if( arguments && arguments.length && arguments[1]){
			//internal use : not setting the cookie, call directly _super()
			arguments[0] = this.validateLocale(arguments[0]);
			if( !arguments[2] && !this.isLoaded(arguments[0]) && !this.isLoading(arguments[0]) ){
// 				this._clearPlaceHoldersEditors();
				this._super('blank');
				this._setBodyClass();
				this.loadLazyTranslations(arguments[0]).then(() => {
// 					this._clearPlaceHoldersEditors();
					this._super(arguments[0]);
					this._syncLanguage();
					this._setBodyClass();
					later(this, function(){this._setEditedPlaceholders();}, 1000);
				});
			}else{
// 				this._clearPlaceHoldersEditors();
				this._super('blank');
				this._setBodyClass();
// 				this._clearPlaceHoldersEditors();
				this._super(arguments[0]);
				this._syncLanguage();
				this._setBodyClass();
				later(this, function(){this._setEditedPlaceholders();}, 1000);
			}
// this.dbgS.log('intl.setLocale(): B - this.locale=', this.locale);
			return;
		}
		arguments[0] = this.validateLocale(locale);
		if( this.locale && this.locale.toString() === arguments[0].toString() ){
			//bypass: see above
// this.dbgS.log('intl.setLocale(): C bypass - this.locale=', this.locale);
			return;
		}
		let date=new Date();
		date.setMonth( date.getMonth()+6 );
		if( arguments[0]!=="blank" && arguments[0]!=="placeholders" )
			this.cookies.write('locale', arguments[0], {path:'/', expires:date});

		if( !this.isLoaded(arguments[0]) && !this.isLoading(arguments[0]) ){
			const	_this = this,
					_locale = arguments[0];
// 			this._clearPlaceHoldersEditors();
			this._super('blank');
			this._setBodyClass();
			this.loadLazyTranslations(arguments[0]).then(() => {
				later(_this, function(){
					_this.setLocale(_locale, true);
				}, 100);
			});
		}else if( this.isLoaded(arguments[0]) ){
// 			this._clearPlaceHoldersEditors();
			this._super(arguments[0]);
			this._syncLanguage();
			this._setBodyClass();
			later(this, function(){this._setEditedPlaceholders();}, 1000);
		}
// this.dbgS.log('intl.setLocale(): D - this.locale=', this.locale);
	},

	_setEditedPlaceholders(){
		let locale = this.locale.toString();
		if(locale === 'blank' || locale === 'placeholders')
			return;
// this.dbgS.log("_setEditedPlaceholders() ", this.locale," - this._changedTranslations:", this._changedTranslations);
		Object.entries( this._changedTranslations ).forEach( ([label, ts]) => {
			this._editablesIDs.forEach( id => {
				let elem = $('#'+id);
				/**/
				if(!elem || !elem.length)
					return;
				elem.removeClass("translateEditing");
				elem.removeClass("translateSaved");
				elem.removeClass("translateEdited");
				/**/
// 				if( label!==this.locale + '.' + elem.attr('placeholder') )
				// We set a bordered class for any placeholder edited, disregarding the edited locale vs the displayed language
				if( label.indexOf('.' + elem.attr('placeholder')) < 0 )
					return;
				if( ts.saved ){
					elem.addClass("translateSaved");
// 					this.dbgS.log(elem[0], '=> $(#'+id+').addClass("translateSaved")');
				}else{
					elem.addClass("translateEdited");
// 					this.dbgS.log(elem[0], '=> $(#'+id+').addClass("translateEdited")');
				}
			});
		});
	},

	_clearPlaceHoldersEditors(){
		this._editablesIDs = [];
		this._installedEditablesIDs = [];
	},

// 	willDestroy() {
// 		this._super(...arguments);
// 	},

	_syncLanguage(){
// date formats:
		if( this.locale.toString() === 'blank' || this.locale.toString() === 'placeholders' )
			moment.locale('en');
		else
			moment.locale(this.locale); // date formats.
		// currentLanguage : used for language list to toggle the labels to the actual locale
        this.currentLanguage = this.languages.find((lang) => lang.iso1 === this.locale.toString());//('name', language.name);
	},

	/** @private **/
	onError({ /* kind, */ error }) {
		throw error;
	},

	_sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
	},

	_reportedTranslations: [],
	_reportedTranslationsStore: [],
	_reportTranslation(status, placeholder, locale, value){
		if( this._reportedTranslations.includes(locale+'.'+placeholder) )
			return false;
		let V7TaggingUtil = true;
		if(status==='missing'){
			V7TaggingUtil = false;
			this.dbgS.warningBubble("translation missing! "+locale+"."+placeholder);//toast for debuggers only
		}
		this._reportedTranslations.push( locale+'.'+placeholder );
		let transStr = this.store.createRecord('translationString', {
			status: status,
			locale: locale,
			placeholder: placeholder,
			v7: true,
			V7TaggingUtil: V7TaggingUtil,//enable only here as this is a special mode for the backend's controller
			route: this.router.currentRouteName,
			url: document.location.toString(),
			user: this.userService.currentUser,
			value: value
		});
		this._reportedTranslationsStore.push(transStr);
		cancel(this._reportTranslation_tout);
		this._reportTranslation_tout = later(this, function(){this._reportTranslationsStack();}, 1000);
		return true;
	},

	async _reportTranslationsStack(){
		const _this = this;
		await this._reportedTranslationsStore.reduce(async (promise, transStr) => {
			// This line will wait for the last async function to finish.
			// The first iteration uses an already resolved Promise
			// so, it will immediately continue.
			await promise;
			const contents = await _this._stackBECalls(transStr);
		}, Promise.resolve());
		this._reportedTranslationsStore = [];//don't send them next time
	},

	async _stackBECalls(transStr){
		await transStr.save().catch(e=>{/*do nothing, be silent!*/});
		await this._sleep(500);
	},

	t( ){
		let locale = this.locale,//In production this will be switched to 'en' (in this call only) in case the string is missing for this placeholder => fallback
			args = arguments,
			placeholder = arguments[0];
		if( args[1] && args[1].locale )
			locale = args[1].locale;
		locale = locale.toString();

		if( document.location.toString().indexOf( "civocracy" ) > 0 ){//no report for local Ember's servers
			let	isMissing = ( !this.exists(placeholder, this.locale) && locale!='blank' && locale!='placeholder' ),
				isReportingV7 = ( this.dbgS.isV7StringsReporter && this.locale.toString() === 'en' );
			if( this._reportedTranslations.includes(locale+'.'+placeholder) || isMissing || isReportingV7 ){
				/*Special code to report missing placeholders in the backend :*/
				this._reportTranslation(isMissing ? "missing" : "active", placeholder, locale, this._super(...args));

				if( isMissing ){
					if( config.environment === 'production' ){
						//In production we always fallback to the EN version, disregarding the config/ember-intl.js setting (=>we never display "Missing ... for locale ...")
						locale = 'en';
						if( args[1] && (typeof args[1]).toLowerCase() === 'object' )
							args[1].locale = locale;
						else args[1]={locale: locale};
					}
				}
			}
		}
		/**/
		let label = this.locale.toString() + "." + placeholder;
		if(!this.translatorToolActivated){
			if( this.locale == "blank" )
				return "";
			else if( this.locale == "placeholders" ){
				if( !args.length )return "";
				return htmlSafe( placeholder );
			}
			if( this._changedTranslations[label] )
				args[0] = this._super( this._changedTranslations[label].content );
			return htmlSafe( this._super(...args) . replace(/\n/g, '<br>' ) );
		}
		/*For activated translator tool */
		let output = "",
			cnt = this._editablesIDs.length+1 ;
		if( this.locale == "placeholders" )
			output = placeholder ;
		else if( this.locale != "blank" ){
			if( this._changedTranslations[label] )
				output = this._changedTranslations[label].content;
			else{
				output = this._super(...args);
				this._originalTranslations[label] = output;
			}
		}
		let id = placeholder.replace(/\./g, '_')  +'_'+ cnt ;
		this._editablesIDs.push(id);
		this._planInstallTranslatorTool();
		return htmlSafe('<span id="' + id + '" class="translateEditable" placeholder="'+placeholder+'"><div class="handle"><div class="container">&#128221;</div></div>' + output.replace(/\n/g, '<br>' ) + '</span>');
	},

	_planInstallTranslatorTool(){
		cancel(this._installTranslatorTools_tout);
		//this._installTranslatorTools_tout = later(this, "installTranslatorTools", 100);
		this._installTranslatorTools_tout = later(this, function(){this.installTranslatorTools();}, 100);
	},

	toggleTranslatorTool(){//the method to call when clicking on the checkered flag in the header : switchers ON/OFF the translator mode
		if(this.translatorToolActivated)
			this.disableTranslatorTool();
		else
			this.activateTranslatorTool();
	},

	activateTranslatorTool(){
		if(this.translatorToolActivated)
			return;
		this._loadAllLocales();
		const loc = this.locale;
		this.setLocale("blank", true, true);
		this.translatorToolActivated = true;
	},

	disableTranslatorTool(){
		if(!this.translatorToolActivated)
			return;
		const loc = this.locale;
		this.translatorToolActivated = false;
// 		_clearPlaceHoldersEditors();
		this.setLocale("blank", true, true);
 		this.setLocale(loc, true);
	},

	_editablesIDs: [],
	_installedEditablesIDs: [],

	installTranslatorTools(){
		const	_eventClickHandler = this._editToolClickEventRetainer.bind(this),
				_eventDblClickHandler = this._editToolOpenEventHandler.bind(this);
		this._editablesIDs.forEach( id => {
			if( this._installedEditablesIDs.indexOf("id")>=0 )
				return;
			let span = $('#' + id);
			if(!span || !span.length)return;
			/*Handler events and positioning*/
			const hcontainer = span.find(".handle .container");
			hcontainer.on('click', (event) => {
				cancel( this._editToolOpener_later );
				event.stopPropagation();
				event.preventDefault();
				this._editToolOpenEventHandler(event);
			});
			hcontainer.on('dblclick', (event) => {
				cancel( this._editToolOpener_later );
				event.stopPropagation();
				event.preventDefault();
				this._editToolOpenEventHandler(event);
			});
			let tp = span.offset(),
				top = tp.top,//(tp.top + span.innerHeight()),
				left = (tp.left + span.innerWidth());
			span.find(".handle").offset({top: top, left: left});
// 			hcontainer.position({top: 0, left: 0});//reseting the unperfect initial css positioning
			hcontainer.css("top", 0);
			hcontainer.css("left", 0);
			/*In-page t container events*/
			span.on('click', _eventClickHandler);
			span.on('dblclick', function(event){
				event.stopPropagation();
				event.preventDefault();
				_eventDblClickHandler(event);
				return false;
			});
			this._installedEditablesIDs.push(id);
		});
	},

	_editToolOpener_pendingEvent: null,
	_editToolOpener_later: null,

	_editToolClickEventRetainer(event){
// 		this.dbgS.log("_editToolClickEventRetainer(", event, ")");
		if( this._editToolOpener_later )
			cancel( this._editToolOpener_later );
		if( this._editToolOpener_later === false ){
			return true;
		}
		this._editToolOpener_pendingEvent = event;

		event.stopPropagation();
		event.preventDefault();

		const _this = this;
		this._editToolOpener_later = later(this, function (){
			if( !_this._editToolOpener_pendingEvent){
				if( _this._editToolOpener_later )
					cancel( _this._editToolOpener_later );
				_this._editToolOpener_later = null;
				return;
			}
			_this._editToolOpener_later = false;// false is not the same than null ! false value is used by _editToolClickEventRetainer to actually accept the event triggering
			_this._editToolOpener_pendingEvent.target.removeEventListener('click', this._editToolClickEventRetainer.bind(this));
			$(_this._editToolOpener_pendingEvent.target).trigger( _this._editToolOpener_pendingEvent );
		}, 1500);//up the timeout if the clicks are to often triggered when the translator double click

		return true;
	},

	_eTEH_currentNode: null,
	_eTEH_currentId: null,
	_eTEH_currentEditor: null,

	_editToolOpenEventHandler(event){
// 		this.dbgS.log("_editToolOpenEventHandler(", event, ")");
		cancel( this._editToolOpener_later );
		this._closeCurrentEditor(event);
		this._editToolOpener_pendingEvent = null;//canceling the single click event : we handle the double one !
		let	target = event.target,
			placeholder = target.getAttribute('placeholder');
		//called from a child ?
		if( !placeholder ){
			do{
				target = target.parentNode;
				placeholder = target.getAttribute('placeholder');
			} while( !placeholder && target.parentNode );
		}
		this._eTEH_currentNode = target;
		this._eTEH_currentId = target.id;
		let idMatch = this._eTEH_currentId.substr(0, this._eTEH_currentId.lastIndexOf('_')+1),
			regexp = new RegExp('^'+idMatch+'(.*)');
		this._editablesIDs.forEach( id => {
			if( regexp.test(id) )
				$('#'+id).addClass("translateEditing");
		});
		this._eTEH_currentEditor = $("<div>");
		this._eTEH_currentEditor.addClass("translateHiddenEditor");
		let qtarget = $(event.target),
			tp = qtarget.offset(),
			top = (tp.top + qtarget.innerHeight()),
			left = (tp.left + qtarget.innerWidth());
		this._eTEH_currentEditor.offset({top: top, left: left});
		const _this = this;
		this.supportedLocales.forEach( locale => {
			if( locale === "blank" || locale === "placeholders" )
				return;
			let label = $('<label>'),
				textarea = $('<textarea>'),
				div = $('<div>');
			label.html( '<span class="locale">' + locale + ' :</span>' );
			label.addClass(locale);
			textarea.attr('placeholder', placeholder);
			if( this._changedTranslations[ locale + "." + placeholder ] ){
				textarea.val(this._changedTranslations[ locale + "." + placeholder ].content);
				if(this._changedTranslations[ locale + "." + placeholder ].saved)
					textarea.addClass('translateSaved');
				else
					textarea.addClass('translateEdited');
			}else{
				let val = this.lookup(placeholder, locale);
				if( !this._originalTranslations[ locale + '.' + placeholder ] )
					this._originalTranslations[ locale + '.' + placeholder ] = val;
				textarea.val(val);
			}
			textarea.addClass(locale);
			if( !this.userService.get('isTranslator' + locale.toUpperCase()) ){
// 				textarea.attr('disabled', 'disabled'); -- the user can't copy the content
				textarea.addClass('disabled');
				textarea.on('keydown', function(){this.get('toast').error( "Sorry you are not allowed to edit this language.", "Not editable" );return false;}.bind(this));
				textarea.on('paste', function(){this.get('toast').error( "Sorry you are not allowed to edit this language.", "Not editable" );return false;}.bind(this));
			}else{
				textarea.on('keyup', _this._handleTranslationChange.bind(_this));
			}
			label.append(textarea);
			div.addClass(locale);
			div.append(label);
			this._eTEH_currentEditor.append( div );
		});

		let close = $('<div>'),
			h1 = $('<h1>'),
			h2 = $('<h2>'),
			submit = $('<button>');
		close.addClass('close');
		close.html('X');
		close.on('click', _this._closeCurrentEditor.bind(_this));
		h1.html('placeholder:');
		h2.html(placeholder);
		this._eTEH_currentEditor.prepend(h2);
		this._eTEH_currentEditor.prepend(h1);
		this._eTEH_currentEditor.prepend(close);

		submit.html('Apply / Save');
		submit.on("click", function(event){_this._submitEditorChanges(event);});
		this._eTEH_currentEditor.append(submit);
		$('body').append(this._eTEH_currentEditor);

// 		dims, remonter si plus bas que bas de page !
	},

	_originalTranslations: {},//list by label (locale+'.'+placeholder) each initial strings to be able to know if a translation has really be changed from it's original version
	_changedTranslations: {},

	_handleTranslationChange(event){
		if(!event.originalEvent)return;
		let locale = event.originalEvent.target.className.replace('translateEdited', '').replace('translateSaved', '').trim();
// this.dbgS.log('_handleTranslationChange(', event,') - locale=' + locale + ' - this.locale=' + this.locale + '\nthis._eTEH_currentNode=', this._eTEH_currentNode);
		let ph = event.target.getAttribute('placeholder'),
			label = locale + "." + ph,
			textareaValue = event.target.value,
			idMatch = this._eTEH_currentId.substr(0, this._eTEH_currentId.lastIndexOf('_')+1),
			regexp = new RegExp('^'+idMatch+'(.*)'),
			stringHasChanged = ( this._originalTranslations[label] && this._originalTranslations[label] !== textareaValue );

 		if( this._originalTranslations[label] )
 			this.dbgS.error( this._originalTranslations[label]+" !== "+textareaValue + "=>" +stringHasChanged );
		if( stringHasChanged ){
			$(event.target.parentNode).removeClass('translateSaved');
			$(event.target.parentNode).addClass('translateEdited');
		}else
			$(event.target.parentNode).removeClass('translateEdited');

		this._editablesIDs.forEach( id => {
			if( regexp.test(id) ){
				let inPageElement = $('#' + id);
				if( locale.toString() === this.locale.toString() )
					//Updating all nodes using this placeholder
					inPageElement.html( '<div class="handle"><div class="container">&#128221;</div></div>' + textareaValue.replace(/\n/g, '<br>'));
				if( stringHasChanged ){
					inPageElement.addClass('translateEdited');
					inPageElement.removeClass('translateSaved');
				}else{
					inPageElement.removeClass('translateEdited');
				}
			}
		});
		this._planInstallTranslatorTool();
		if( !this._changedTranslations[label] )
			this._changedTranslations[label] = {
				/*target: event.target,*/
				v7: true,
				placeholder: ph,
				locale: locale,
				content: textareaValue,
				saved: false
			};
		else{
			this._changedTranslations[label].content = event.target.value;
			this._changedTranslations[label].saved = false;
		}
	},

	_closeCurrentEditor(){
		this.closePopupTranslationsSummary();
		if( this._eTEH_currentEditor )
			this._eTEH_currentEditor.remove();

		this._eTEH_currentEditor = null;
		if( !this._eTEH_currentNode )
			return;
/*
		this._editablesIDs.forEach( id => {
			let elem = $('#'+id);
			if(!elem || !elem.length)
				return;
			elem.removeClass("translateEditing");
			if( this._changedTranslations[this.locale + '.' + elem.attr('placeholder')] ){
				if( this._changedTranslations[this.locale + '.' + elem.attr('placeholder')].saved ){
					elem.addClass("translateSaved");
					console                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .log('=> $(#'+id+').addClass("translateSaved")');
				}else{
					elem.addClass("translateEdited");
console.log('=> $(#'+id+').addClass("translateEdited")');
				}
			}
console.log('_closeCurrentEditor() $(#'+id+') {', elem,'} : this._changedTranslations['+ this.locale + '.' + elem.attr('placeholder') + ']=', this._changedTranslations[this.locale + '.' + elem.attr('placeholder')], ' - elem.attr(class)=', elem.attr('class') );
		});
*/
		later(this, function(){this._setEditedPlaceholders();}, 1000);
		this._eTEH_currentNode = null;
	},

	_submitEditorChanges(event){
		const _this = this;
this.dbgS.error( "_submitEditorChanges::Saving to BE :", this._changedTranslations );
		Object.entries( this._changedTranslations ).forEach( ([label, datas]) => {
			let entry = this.store.createRecord('translationString', {
				status: "pending",//we keep this status here but actually the backend will validate it directly with STATUS_VALIDATED
				v7: true,
				placeholder: datas.placeholder,
				locale: datas.locale,
				value: datas.content,
				route: this.router.currentRouteName,
				url: document.location.toString(),
				user: this.userService.currentUser
			});
this.dbgS.error("_submitEditorChanges-"+label+"::\ndatas=", datas, "\nentry=", entry);
			entry.save()
				.then(function(){
					_this.dbgS.log("_submitEditorChanges SUCCESS! ", arguments);
					_this._changedTranslations[label].saved = true;
					later(_this, function(){_this._setEditedPlaceholders(null);}, 1000);
				})
				.catch(function(error){
					_this.dbgS.error("_submitEditorChanges FAILURE! ", arguments);
					_this._changedTranslations[label].saved = false;
					throw error;
				});
		});
		this._closeCurrentEditor();
// 		this.rerenderStrings();
	},

	_saveEditorChange(event, label){
		if( !this._changedTranslations[label] )
			return false;
		const _this = this;
this.dbgS.error("_saveEditorChange-"+label+"::Saving to BE :", this._changedTranslations[label]);
		let datas = this._changedTranslations[label],
			entry = this.store.createRecord('translationString', {
				status: "pending",//we keep this status here but actually the backend will validate it directly with STATUS_VALIDATED
				v7: true,
				placeholder: datas.placeholder,
				locale: datas.locale,
				value: datas.content,
				route: this.router.currentRouteName,
				url: document.location.toString(),
				user: this.userService.currentUser
			});
this.dbgS.error("_saveEditorChange-"+label+"::\ndatas=", datas, "\nentry=", entry);
		let ret = false;
		entry.save()
			.then(function(){
				this.dbgS.log("_saveEditorChange SUCCESS! ", arguments);
				_this._changedTranslations[label].saved = true;
				let bt = $('#saveIt_'+ label.replace(/\./g, '_'));
				bt.addClass('applied');
				bt.attr('disabled', true);
				ret = true;
			})
			.catch(function(error){
				this.dbgS.error("_saveEditorChange FAILURE! ", arguments);
				_this._changedTranslations[label].saved = false;
				ret = false;
				throw error;
			});
		return ret;
	},

	rerenderStrings(){
		let loc = this.locale;
		this.setLocale('blank', true, true);
		this.setLocale(loc, true);
	},


	_pTS_currentPopup: null,
	popupTranslationsSummary(){
		if( this._pTS_currentPopup )return;
		this._pTS_currentPopup = $('<div>');
		this._pTS_currentPopup.addClass('translations-summary-popup');
		/**/
		let close = $('<div>'),
			h1 = $('<h1>'),
 			ulList = [],
			fieldsets = [],
			cntAdd = 0;
		close.addClass('close');
		close.html('X');
		close.on('click', this.closePopupTranslationsSummary.bind(this));
		this._pTS_currentPopup.prepend(close);
		h1.html("Translations summary");
		this._pTS_currentPopup.append(h1);

		/**/
		const _this = this;
		let lis = [];
		Object.entries( this._changedTranslations ).forEach( ([label, datas]) => {
			if( !ulList[datas.placeholder] ){
				fieldsets[ fieldsets.length ] = $('<fieldset>');
				fieldsets[ fieldsets.length-1 ].append( $('<legend>').html("Placeholder : " + datas.placeholder) );
				ulList[datas.placeholder] = $('<ul>');
				fieldsets[ fieldsets.length-1 ].append( ulList[datas.placeholder] );
			}

			if( !this._originalTranslations[label] || (this._originalTranslations[label] !== datas.content) ){
				cntAdd ++ ;
				let li = $('<li>'),
					labelH = $('<label>'),
					divNT = $('<div>'),
					divLT = $('<div>');
				labelH.html(datas.locale);
				li.append(labelH);
				li.append($('<span>').html(' changed to '));
				divNT.text( datas.content );
				if( datas.saved ){
					divNT.addClass('saved');
				}
				li.append(divNT);
				li.append($('<span>').html(' from'));
				divLT.text( this._originalTranslations[label] );
				li.append(divLT);
				if( !datas.saved ){
					let saveIt = $('<button>');
					saveIt.attr('id', 'saveIt_'+ datas.locale + '_' + datas.placeholder.replace(/\./g, '_') );
					saveIt.html('Apply / Save');
					saveIt.on("click", function(event){
						_this._saveEditorChange(event, datas.locale + '.' + datas.placeholder);
					});
					li.append(saveIt);
				}else{
					let b = $('<b>');
					b.html('Saved');
					b.addClass(cntAdd);
					li.append(b);
				}
				ulList[datas.placeholder].append(li);
			}
		});
		this._pTS_currentPopup.append(fieldsets);

		$('body').append(this._pTS_currentPopup);
		this._pTS_currentPopup.offset( {top: 30, left: ($('body').innerWidth() / 2) - (this._pTS_currentPopup.outerWidth() / 2) } );
	},

	closePopupTranslationsSummary(){
		if( this._pTS_currentPopup ){
			this._pTS_currentPopup.remove();
			this._pTS_currentPopup = null;
		}
	},

});
