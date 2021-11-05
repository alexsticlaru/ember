import Service from '@ember/service';
import config from 'civ/config/environment' ;
import { inject as service } from '@ember/service';

export default class LinkPreviewService extends Service {
  @service session;

  async getPreviewData(url) {
    //Request payload
    const params = {"url":url};
    //Request URL and token
    // const token = this.session.data.authenticated.access_token;
    const host = config.APP.API_HOST;

    const response = await fetch(host + "/api/linkpreview", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(params), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
    // .then(response => response.json())
    //   .then(data => {
    //     return data;
    // })
  }

}
