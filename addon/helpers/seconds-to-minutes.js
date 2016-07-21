import Ember from 'ember';

export function secondsToMinutes(params/*, hash*/) {

    var d = Number(params);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);

}

export default Ember.Helper.helper(secondsToMinutes);
