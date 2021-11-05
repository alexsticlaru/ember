/**
 * This function converts a hex color to a rgb structure.
 *
 * Usage:
 * var rgb = hexToRgb("#ffffff") ;
 * console.log(rgb) ; // { r: 255, g:255, b:255 }
 *
 * @method hexToRgb
 * @param hex Hexadecimal color
 */
export default function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
