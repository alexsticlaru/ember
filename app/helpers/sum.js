import Helper from '@ember/component/helper';

export function sum(params) {
	return params[0] + (params[1] || 0);
}

export default Helper.helper(sum);