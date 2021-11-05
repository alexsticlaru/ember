import DS from 'ember-data';
import Association from 'civ/models/association' ;

const {
	belongsTo,
} = DS;

export default Association.extend({
	content: belongsTo('community'),
	community: belongsTo('community'),
	// Foreign attributes
	type:'community-association',
}) ;
