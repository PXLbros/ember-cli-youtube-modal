import Ember from 'ember';

export function durationDivider(params/*, hash*/) {
    if (params[0] === undefined) {
        return '/'
    } else {
        return params
    }
}

export default Ember.Helper.helper(durationDivider);
