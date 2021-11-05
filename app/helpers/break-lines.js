import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';

/**
 * Converts line-breaks to HTML <br> elements in a string.
 *
 * @param params A string containing '\n\r' line-breaks
 * @returns A string containing '<br>' line-breaks
 */
export function breakLines(params/*, hash*/) {

    let content = params ? params[0] : null ;
	if ( content ) {
		content = content.replace(/\n\r?/g, '<br>');
		return htmlSafe(content);
	}

	return '' ;
}

export default Helper.helper(breakLines);
