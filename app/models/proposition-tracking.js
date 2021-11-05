import DS from 'ember-data';

const {
	Model,
	belongsTo,
} = DS ;

export default Model.extend({
	content: belongsTo('proposition'),
	user: belongsTo('user')
});
