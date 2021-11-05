import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;

const {
	Model,
	attr,
} = DS ;

export default Model.extend( {


	commentStats: attr(),
	participantStats: attr(),
	visitStats: attr(),
	stakeholdings: attr(),
	recommendations: attr(),

});
