import Service from '@ember/service';
import config from 'civ/config/environment' ;
import { inject as service } from '@ember/service';

export default class BadgeService extends Service {
  @service session;

   markAsConstructive(content){
     //Request URL and token
     const token = this.session.data.authenticated.access_token;
     const host = config.APP.API_HOST;

     fetch(host + "/api/comments/" + content.id + "/setbadge?status=1&badge=topDown?access_token=" + token, {
       method: 'POST', // or 'PUT'
       headers:{
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + token,
       }
     }).then(() => {
       content.badges = [] ;
       content.badges.push('topDown') ;
     })
   }

}
