import Helper from '@ember/component/helper';
import { isEmpty } from '@ember/utils';

export default Helper.helper( function (params) {

	let user = params[0] ;
	if ( typeof user === 'string' ) {
		return user ;
	}

	let  text = user.get('fullName'),
	community = user.get('community'),
	userRole = params[1] ;

	if ( community != null && !isEmpty(community.get('name')) ) {
		text =  text + ', ' + community.get('name') ;
	}

	if (userRole) {
		text = text + " " + userRole ;
	}

	return text ;

});
