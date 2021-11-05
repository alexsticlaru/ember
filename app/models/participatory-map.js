import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

/**
 * This is the PM model.
 * @class {Model} ParticipatoryMap
 */
export default Model.extend({
  name: attr('string'),
  description: attr('string'),
	zoomLevel: attr('number'),
	centerLat: attr('number'),
	centerLong: attr('number'),
	community: belongsTo('community'),
	pmMarkers: hasMany('pm-marker'),

  }) ;
