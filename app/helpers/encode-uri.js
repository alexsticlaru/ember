import Helper from '@ember/component/helper';

export function encodeUri(params/*, hash*/) {
  return encodeURI(params[0]);
}

export default Helper.helper(encodeUri);
