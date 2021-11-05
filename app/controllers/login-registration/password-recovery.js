import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import config from '../../config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import {
    isNotFoundResponse
  } from 'ember-fetch/errors';

export default class PasswordRecoveryController extends Controller {
    @service intl;
    @service toast;
    @service phone;
	@service('popup') popupService;
    @tracked showSpinner = false;
    @tracked showEmailRequiredMessage = false;

    @action
    validateEmail() {
        this.showEmailRequiredMessage = isEmpty(this.email);
    }

    @action
	hideModal() {
		this.popupService.close();
	}
    
    /**
    * Sends the password request.
    * The back-end will then send an email to the user,
    * containing a link to reset his password.
    * @method submitPopup
    */
    @action
	submitPopup(e) {
        e.preventDefault();
        if ( !isEmpty(this.email) ) {
            this.showSpinner = true;
            fetch(`${config.APP.API_HOST}/api/passwordrequest?email=${this.email}`
                ).then((rsp) => {
                    this.showSpinner = false;
                    this.handleResponse(rsp);
                }).catch( () => {
                    this.showSpinner = false;
                    this.toast.error(this.intl.t('bubble.error.unknown'));
                })
        } else {
             this.showEmailRequiredMessage = true;
        }
    }
    
    handleResponse(rsp) {
        if(rsp.ok) {
            this.toast.success(
                this.intl.t('bubble.password.recovery.confirm'),
                this.intl.t('bubble.password.recovery.confirm.title')
            );
        } else if(isNotFoundResponse(rsp)){
            this.toast.info(
                this.intl.t('bubble.error.unknownUser')
            );
        } else {
            this.toast.error(
                this.intl.t('bubble.error.unknown')
            );
        }
    }

    @action
    closePage() {
        this.phone.hidePhonePage();
    }
    
}
