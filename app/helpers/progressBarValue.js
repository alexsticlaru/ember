import { helper } from '@ember/component/helper';

export function progressBarValue(params) {
	// return (params[0] / 100) * params[1];
	return (params[0] / params[1]) * 100;
}

export default helper(progressBarValue);
