import { inject as service } from '@ember/service';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'civ/config/environment';

// import { action } from "@ember/object";

export default class OAuth2Authenticator extends OAuth2PasswordGrant {
    serverTokenEndpoint = `${config.APP.API_HOST}/oauth/v2/token`;
    clientId = "1_3qn8lacme44kwwg0g84g00gowkgssc8o44go88ko4w8w0wk448";
    refreshAccessTokens = true;
    serverTokenRevocationEndpoint = `${config.APP.API_HOST}/oauth/v2/revoke`;
}
