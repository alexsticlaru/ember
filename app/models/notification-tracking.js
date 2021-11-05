import DS from 'ember-data';
const { Model, belongsTo, attr } = DS ;

export default Model.extend({
	content: belongsTo('notification'),
	user: belongsTo('user'),
	useCase: attr('string')
});
