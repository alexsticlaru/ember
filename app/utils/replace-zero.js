
export default function replaceZero(param) {
	let value = param ;
	if ( typeof param === "object" ) {
		value = param[0] ;
	}
	return (value == 0) ? "-" : value;
} 

