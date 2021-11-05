import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';

/**
 * Use JKW_Utils/traceKit.js to output the backtrace from curent call to the console
 * To use in templates : {{dbg_log_trace}}
 *
 * @returns A string
 */
export function dbg_log_trace(){
	console.warn('log_dbg_trace:'+htmlSafe(trace()));
	return '';
}

export default Helper.helper(dbg_log_trace);
