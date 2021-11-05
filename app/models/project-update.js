import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectUpdateModel extends Model {
	@attr('string') title;
	@attr('date') date;
	@attr('string') image;
	@attr('string') content;
	@attr('string') status;
	@belongsTo('project', { inverse: 'projectUpdates', async: false}) project;

	@attr('boolean') notificationAllowed; //does the admin wants to send an email notification once the update is published ?
	@attr('boolean') notificationSent; //if notificationAllowed are the email notifications already sent ?
	@attr('date') notificationSentDate;

	@attr('boolean') scheduled;
	@attr('date') scheduledDate;

	get displayDate() {
		return moment( this.get('date') ).fromNow() ;
	}

	get dateAndTime() {
		const options = { year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute: 'numeric' };
		return this.get('date').toLocaleDateString("en-US", options);
	}



}
