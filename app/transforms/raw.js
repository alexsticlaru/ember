import DS from 'ember-data';
const {Transform} = DS;

export default Transform.extend({
	deserialize: data => data,
	serialize: data => data
});
