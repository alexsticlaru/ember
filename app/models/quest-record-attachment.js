import Model, { attr, belongsTo } from '@ember-data/model';

export default class QuestRecordAttachmentModel extends Model {

  @belongsTo('quest-record') content;
  @attr('string') url;
  @attr('string') type;
  @attr('string') image;
  @attr('string') name;
  @attr('string') description;

}
