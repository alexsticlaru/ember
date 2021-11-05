import Service from '@ember/service';
import config from 'civ/config/environment' ;
import { inject as service } from '@ember/service';

export default class FlagItemService extends Service {
  @service session;

  flag(reportType, content) {
    //Request payload
    const params = {"content":content.id, "report":reportType};
    //Request URL and token
    const token = this.session.data.authenticated.access_token;
    const host = config.APP.API_HOST;

    // the modelName determines the url to the call
    // e.g. propositions
    //unfortunately we have to add an s to the modelName. so proposition becomes propositions

    const response = fetch(host + "/api/" + content.constructor.modelName + "s/" + content.id + "/flag?access_token=" + token, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(params), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(() => {
      content.set("isFlaggedByCurrentUser", true);
    })
    return response;
  }

}
