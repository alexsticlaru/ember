
import { htmlSafe } from '@ember/string';
import Helper from '@ember/component/helper';

export default Helper.helper( params => {
    return htmlSafe(params.join(''));
});
