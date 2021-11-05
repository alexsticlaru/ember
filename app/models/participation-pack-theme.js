import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from "@glimmer/tracking";

export default class ParticipationPackTheme extends Model {
	@attr('string') name;
	@belongsTo('participation-pack') participationPack;

	@tracked isSelected;
}
