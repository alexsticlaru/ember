
export default function formatPercent(param) {
	let value = param ;
	if ( typeof param === "object" ) {
		value = param[0] ;
	}

	value = Math.round( value*100 ) ;

	if ( value == 0 ) {
		return "► 0%" ;
	}

	if ( value == -100 ) {
		return "";
	}

	return ( value < 0 ) ?
		( "▼ " + Math.abs(value) + "%" ) :
		( "▲ " + value + "%" ) ;
} 

