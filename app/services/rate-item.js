import Service from '@ember/service';
import config from 'civ/config/environment' ;
import { inject as service } from '@ember/service';

export default class RateItemService extends Service {

  @service session;

  vote(relevancy, user, content) {  //the relevancy is either an upvote (1) or a downvote (-1)

		//Update view before submitting, so that we don't have a lag on the proposition upvoting
		//set userRelevancy and increment globalRelevancy
		content.userRelevancy = relevancy;
		content.globalRelevancy = content.globalRelevancy+relevancy;

		//Request payload
		const params = {"user":user.id,"content":content.id,"relevancy":relevancy};
		//Request URL and token
		const token = this.session.data.authenticated.access_token;
		const host = config.APP.API_HOST;

    // the modelName determines the url to the call
    // e.g. commentratings or assertionratings

		fetch(host + "/api/" + content.constructor.modelName + "ratings?access_token=" + token, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify(params), // data can be `string` or {object}!
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(function() {
      //toast success?

			}).catch(function(error) {
				console.log(error);
				console.log("sth went wrong");
			});
	}

}
