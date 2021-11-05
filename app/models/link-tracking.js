import DS from 'ember-data';
const { Model, belongsTo, attr } = DS ;

export default Model.extend({
	content: belongsTo('link'),
	user: belongsTo('user'),
	useCase: attr('string')
});
