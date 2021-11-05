import { helper } from '@ember/component/helper';

export function numberEven(number) {
	return (number % 2) === 0;
}

export default helper(numberEven);
