import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { on } from '@ember/object/evented';
import Ember from 'ember';
import config from 'civ/config/environment' ;
import BaseListener from 'ember-error-handler/listener/base-listener';
import ErrorDescriptor from 'ember-error-handler/error-descriptor';
// node_modules/ember-error-handler/addon/listener/base-listener.js

/*TODO:
 * We need a better handling for 40X http status returned from the back-end
 * Sometime when logged and the token became outdated, the backend returns a 401 invalid_grant  and we have a white page...
 *
 * https://stackoverflow.com/questions/13349035/emberjs-handle-401-not-authorized
DS.reopen({
    ajax: function(url, type, hash) {
        var originalError = hash.error;
        hash.error = function(xhr) {
            if (xhr.status == 401) {
                var payload = JSON.parse(xhr.responseText);
                //Check for your API's errorCode, if applicable, or just remove this conditional entirely
                if (payload.errorCode === 'USER_LOGIN_REQUIRED') {
                    //Show your login modal here
                    App.YourModal.create({
                        //Your modal's callback will process the original call
                        callback: function() {
                            hash.error = originalError;
                            DS.ajax(url, type, hash);
                        }
                    }).show();
                    return;
                }
            }
            originalError.call(hash.context, xhr);
        };
        //Let ember-data's ajax method handle the call
        this._super(url, type, hash);
    }
});
*/

export default BaseListener.extend({
	//userService: Ember.inject.service('user'),
	session:   service(),
	dbgS:   service('debug'),
	toriiService:   service('torii'),
	popupService:   service('popup'),//we are only using it for now to get a hand on the main route to make a page refresh when an AccessToken bug appears.
	errorEmberConsumer: service('error-ember-consumer'),

	_handlerTimer:null,
	_handlerConsecutives:0,
	_handlerConsecutives_max:4,//We catch and report _handlerConsecutives_max consecutive errors if different (only one if similar) in the _handlerMinDelay, after that we wait the delay to be done (_handlerTimer's job) + there is a report counter in the consumer : no more report if _errorReportsSentMax sent reports. NB: the best would be to bufferize error reports and send them altogether but may create issues and heavy storage in browser memory and we don't want that...
	_handlerMinDelay:2000,
/*
	initServices: on('init', function () {
		this.get('dbgS');
	}),
*/
    init() {

		if(!window.trace)
			window.trace = function (){}

		this._super(...arguments);
		$(window).on('hashchange', function(){
			//Light weight, just a trigger
			$(window).trigger('yourCustomEventName');
		});
        this._super.apply(this, arguments);
        if (!getOwner(this)) {
            throw new Error('Application container must be defined for ember-listener');
        }
    },

	_shouldCatch_lastError: null,
	_shouldCatch( error ){
		if( !error.isNormalized )
			error = this.errorEmberConsumer._descriptorNormalize(error);
		const _this = this;
		let dbgLogReturnFalse = function( index ){
			_this.get('dbgS').log('service error-ember-listener.js _shouldCatch('+index+') returned "NO!" : _handlerTimer:'+_this._handlerTimer+' - _handlerConsecutives:'+_this._handlerConsecutives+"\nerror.message=", error.error.message, "\nerror=", error);
		};
		if(!error || !error.error || !error.isError){
			dbgLogReturnFalse("A");
			return false;
		}
		if(this._shouldCatch_lastError && ( ( this._shouldCatch_lastError.message && error.message == this._shouldCatch_lastError.message ) || ( this._shouldCatch_lastError.error.message && error.error.message == this._shouldCatch_lastError.error.message ) ) ){
			dbgLogReturnFalse("B");
			return false;
		}
		this._shouldCatch_lastError = error;
		if( !this._handlerTimer ){
			//this.get('dbgS').error("service error-ember-listener.js _shouldCatch - _handlerTimer SET");
			this._handlerConsecutives = 1;
			clearTimeout(this._handlerTimer);
			this._handlerTimer = setTimeout( function(){
				clearTimeout(_this._handlerTimer);
				_this._handlerTimer=null; /*this.get('dbgS').error("service error-ember-listener.js _shouldCatch - _handlerTimer  RELEASED");*/
				this._handlerConsecutives = 0;//reset counter
			} , this._handlerMinDelay );
		}else{
			this._handlerConsecutives++;
		}
		if( this._handlerConsecutives > this._handlerConsecutives_max ){
			//this.get('dbgS').error("service error-ember-listener.js _shouldCatch - RETURN FALSE");
			dbgLogReturnFalse("C");
			return false;
		}
		//this.get('dbgS').error("service ember-error-listener.js _shouldCatch - RETURN TRUE");
		/* Workarounds for specific not handable errors ::*/
		if( error ){
			let errorMsg = error.error ? error.error.message.toString() : "";
			if( errorMsg.indexOf("The play method is not allowed by the user agent") >= 0 ){
				//dbgLogReturnFalse("D"); - don't bother...
				return false;
			}
		}
		/*:: Workarounds for specific errors */
		this.get('dbgS').error('service error-ember-listener.js _shouldCatch() returned "YES!" : _handlerTimer:'+this._handlerTimer+' - _handlerConsecutives:'+this._handlerConsecutives+"\nerror.message=", error.error.message, "\nerror=", error, "\ntrace:", trace());
		return true;
	},

    listen(manager) {
// 		this.get('dbgS').error("service error-ember-listener.js listen');
        const	owner = getOwner(this),
				listener = this,
				errorEmberConsumer = this.errorEmberConsumer;
        //Capturing errors within action events
        Ember.ActionHandler.reopen({
            send: function (actionName) {
                try {
					this._super(...arguments);
					return false;
                } catch (error) {
					error = errorEmberConsumer._descriptorNormalize(error);
					if( !listener._shouldCatch(error) || errorEmberConsumer.bsodIsRendered )
						return;
                    manager.consume(
                        ErrorDescriptor.create({
                            source: `ember.ActionHandler:${actionName}`,
                            listener: listener,
							error: error
                        })
                    );
                }
            }
        });

        //Capturing errors during transitions:
        const ApplicationRoute = owner.lookup('route:application');
        ApplicationRoute.reopen({
            actions: {
				error: function (error) {
// alert("ApplicationRoute.reopen");
					if( errorEmberConsumer.bsodIsRendered )
						return;
					error = errorEmberConsumer._descriptorNormalize(error);
 					listener.get('dbgS').error('service error-ember-listener.js route.reopen actions', error);
					if( !listener._shouldCatch(error) )return;
                    manager.consume(
                        ErrorDescriptor.create({
                            source: `ember-ApplicationRoute.reopen`,
                            listener: listener,
                            error: error
                        })
                    );
                }
            }
        });

		Ember.Logger.error = function (message, cause, stack) {
			listener.get('dbgS').dbgS.log('Ember.Logger.error handler', message, cause, stack);
		};
		RSVP.on('error', function(error) {
			RSVP.onerror(error);
		});

        //Capturing RSVP errors
        RSVP.onerror = function (error) {
			if( errorEmberConsumer.bsodIsRendered )
				return;
 			listener.get('dbgS').error('service error-ember-listener.js RSVP onerror', error);

			error = errorEmberConsumer._descriptorNormalize(error);
			if( !listener._shouldCatch(error) )return;
            manager.consume(
                ErrorDescriptor.create({
                    source: `Ember.RSVP.onerror`,
                    listener: listener,
					error: error
                })
            );
        };


		//Capturing ember errors
		Ember.on('error', function (error) {
			Ember.onerror(error);
		});
		Ember.onerror = function (error) {
			if( errorEmberConsumer.bsodIsRendered )
				return;
listener.get('dbgS').error('service error-ember-listener.js Ember.onerror\nerror=', error);
			let errorOut = error;
			error = errorEmberConsumer._descriptorNormalize(error);
			if( !(!errorOut.stack) ){
				errorOut.stack.replace('\\n', "\n");
			}
			if( listener.get('dbgS._isInfinityLoading') && error.message.indexOf('The response to store.query is expected to be an array') > -1 ){
				//Bypassing the error throwed by ember-Infinity at the end of the list
				listener.get('dbgS').log('Skipped: Infinity reaches the end of the list');
				listener.set('dbgS._isInfinityLoading', false);
				//and hidding the loading anim:
				listener.set('dbgS.infinityEnded', true);
				return;
			}
// 			listener.get('dbgS').error('service error-ember-listener.js Ember.onerror\nerror=', error, '\nerrorOut=', errorOut);
			if( !(!error.message) && ( (error.message.indexOf('401') >=0 && error.message.indexOf('/api/users/') >=0) || (error.message.indexOf('session is null')>=0) ) ){
				//AccessToken bug with cookie and expired session (payload={"error":"invalid_grant","error_description":"The access token provided is invalid."})
				//We clean the session cookie and try reloading
				//let route = ??
				//route.refresh();
				listener.get('dbgS').error('service error-ember-listener.js closing session');
				listener.get('session').close().then( function() {
					listener.get('dbgS').alert("service error-ember-listener.js : session closed, refreshing !");
					//listener.get('target.router').refresh();
					//listener.get('dbgS').alert( listener.controllerFor("application") );
					//tweaking...
					listener.get('popupService').popup_renderer.refresh();
				}) ;
			}
			if( !listener._shouldCatch(error) )return;
            manager.consume(
                ErrorDescriptor.create({
                    source: `ember.onerror`,
                    listener: listener,
					error: error
                })
            );
        };

        // window listener
		window.onerror = (message, file, line, column, error) => {
			if( errorEmberConsumer.bsodIsRendered )
				return;
 			listener.get('dbgS').error('service error-ember-listener.js window.onerror', message, file, line, column, error);
			if( !listener._shouldCatch(error) )return;
            if (!error) {
                error = {
                    message: message,
                    name: String(error),
                    stack: message + ' at ' + "\n" + file + ':' + line + ':' + column
                };
			}
			error = errorEmberConsumer._descriptorNormalize(error, message, file, line, column);
            manager.consume(
                ErrorDescriptor.create({
                    source: 'window.onerror',
					listener: listener,
                    error: error
                })
            );
            return true;
        };

        // unhandled promise listener
        window.addEventListener('unhandledrejection', function (event) {
// alert("window.addEventListener('unhandledrejection') (", event,")");
// 			listener.get('dbgS').error('service error-ember-listener.js window.unhandledrejection', event);
            let error = event.reason;
            if (!error) {
				listener.get('dbgS').error('service error-ember-listener.js window.unhandledrejection : no error in event ! SKIPPING', event);
				/*
                error = {
                    message: error.message,
                    name: String(error),
                    stack: ''
                };
				*/
			}else{
				if( errorEmberConsumer.bsodIsRendered )
					return;
				error = errorEmberConsumer._descriptorNormalize(error);

				if( !listener._shouldCatch(error) )return;
				manager.consume(
					ErrorDescriptor.create({
						source: 'window.listener.unhandledrejection',
						listener: listener,
						error: error
					})
				);
			}

            //event.preventDefault();
        });

    }


});
