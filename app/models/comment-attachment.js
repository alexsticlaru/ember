import Model, { attr, belongsTo } from '@ember-data/model';

export default class CommentAttachmentModel extends Model {

  @belongsTo('comment') content;
  @attr('string') url;
  @attr('string') type;
  @attr('string') image;
  @attr('string') name;
  @attr('string') description;


}
