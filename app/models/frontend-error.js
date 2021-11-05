import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({
	fatal: attr('boolean'),
	useragent: attr('string'),
	url_prev: attr('string'),
	url_cur: attr('string'),
	locale: attr('string'),
	user: belongsTo('user'),
	isDebugger: attr('boolean'),
	source: attr('string'),
	report: attr('string'),
	stack: attr('string'),
	fileName: attr('string'),
	lineNumber: attr('number'),
	columnNumber: attr('number'),
});
