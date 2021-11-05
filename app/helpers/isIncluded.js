import { helper } from '@ember/component/helper';

export function isIncluded(params) {
	return params[1].includes(params[0]);
}

export default helper(isIncluded);
