import DS from 'ember-data';
const {
	Model,
	attr,
} = DS ;

export default Model.extend({

    name: attr('string'),
    status: attr('string'),
    locale: attr('string'),
    type: attr('string'),
    possibleValues: attr(),

});
