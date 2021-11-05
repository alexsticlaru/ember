import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr
} = DS ;

export default Model.extend({
	content: belongsTo('quest-form'),
	user: belongsTo('user'),
	anonymousUser: belongsTo('quest-anon-user'),
	useCase: attr('string'),
	countSeen: attr('number'),
	countClick: attr('number'),
	countCompleted: attr('number'),
	dateFirstSeen: attr('date'),
	dateLastSeen: attr('date'),
	dateLastClick: attr('date'),
	dateLastCompleted : attr('date'),
});
