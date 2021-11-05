import Helper from '@ember/component/helper';

export function stringify(params/*, hash*/) {

    let seen = [];

    let antiCyclic = function (key, val) {
        if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
                return;
            }
            seen.push(val);
        }
        return val;
    };

    return JSON.stringify(params.pop(), antiCyclic, 2);
}

export default Helper.helper(stringify) ;

