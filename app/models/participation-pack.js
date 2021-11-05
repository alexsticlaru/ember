import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ParticipationPackEntity extends Model {
	@attr('string') title;
	@attr('string') name;
	@attr('string') description;
	@attr('string') image;
	@attr('string') type;
	@attr('string') url;
	@attr('number') orderNumber;
	@belongsTo('community') community;
	@belongsTo('project') project;
	@belongsTo('issue') issue;
	@belongsTo('idea-box') ideaBox;
	@belongsTo('quest-form') questionnaire;
	@attr('number') participantsCount;
	@attr('number') contributionsCount;
	@hasMany('participation-pack-theme') themes;
	@attr('date') dateBegin;
	@attr('date') dateEnd;
	@attr('boolean') published;
	@attr('string') visibility;

	get usersCanParticipate() {
		if (this.dateBegin < new Date() && this.dateEnd > new Date()) {
			return true;
		} else {
			return false;
		}
  }

	get sortedThemes() {
		return this.themes.sortBy('name');
	}


}
