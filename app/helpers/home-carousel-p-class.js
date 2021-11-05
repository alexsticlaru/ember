import Helper from '@ember/component/helper';

export default Helper.helper( function (params) {

	let community = params[0] ;
  const communityName = community.get('name');
  if (communityName.length > 28) {
    return "caption long-name";
  }
  return "caption";
});
