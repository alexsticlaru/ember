import Model, { attr, belongsTo, hasMany  } from '@ember-data/model';

export default class UserRight extends Model {
// 	label: attr('string'),
// 	entities: attr()
	@attr('string') label;
	@attr([]) entities;
// 	@belongsTo('user') userRe;
 	@belongsTo('user') user ;
// 	_tempModelName = "user-right";
};
