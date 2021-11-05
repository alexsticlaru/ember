/*
** FORMAT GOOGLE GRAPH UTIL
** expected data = [{date, value}, ...]
*/

import FormatDate from './format-date';

export default (xName, yName, data, locale = 'en') => {
	let graph = [[xName, yName]];
	data.forEach((point) => {
		graph.push([FormatDate(point.date, locale, true), point.value]);
	});
	return graph;
};
