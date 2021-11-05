/**
 * This function truncates strings with respect to word boundaries.
 */
export default function truncate( n, useWordBoundary ) {
    let isTooLong = this.length > n,
        s_ = isTooLong ? this.substr(0,n-1) : this ;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_ ;
    return  isTooLong ? s_ + '…' : s_ ;
}

// Usage:
// var s = 'not very long' ;
// truncate.apply(s, [11, true]) ;
// => not very...

