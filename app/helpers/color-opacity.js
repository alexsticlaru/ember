import { helper } from '@ember/component/helper';

export function colorOpacity(params) {
    if(params[0] < 10) {
        return '0.0' + params[0];
    } else if (params[0] === 100) {
        return 1;
    } else {
        return '0.' + params[0];
    }
}

export default helper(colorOpacity);