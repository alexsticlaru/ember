import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({
  // again check the fields in the database
  text: attr('string'),
  status: attr('string'),
  type: attr('string'),
  date: attr('date'),
  addedBy: belongsTo('user'),
  content: belongsTo('comment')
});
