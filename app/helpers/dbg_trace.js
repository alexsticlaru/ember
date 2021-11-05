import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';

/**
 * Use JKW_Utils/traceKit.js to output the backtrace from curent call
 * To use in templates (direct output on page) : {{dbg_trace}}
 *
 * @returns A string
 */
export function dbg_trace(params) {
	return 'dbg_trace:'+htmlSafe(trace());
}

export default Helper.helper(dbg_trace);
