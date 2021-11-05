import Service from '@ember/service';
import config from 'civ/config/environment' ;
import { inject as service } from '@ember/service';

export default class AdminService extends Service {
  @service session;

  //this service is only to set the admin status for communities (not for projects)
  //for projects we simply change the admin level of the project-following entity

  setAdminLevel(user, community, adminLevel) {
    const token = this.session.data.authenticated.access_token;
    const host = config.APP.API_HOST;

    fetch(host
      + "/api/changecommunityadminlevel?access_token=" + token
      + "&user=" + user
      + "&community=" + community
      + "&adminLevel=" + adminLevel,
    {
      method: 'PUT',
    });
  }
}
