import Ember from 'ember';

export function secondsToMinutes(params) {

    var digits = Number(params);

    var hours = Math.floor(digits / 3600);
    var minutes = Math.floor(digits % 3600 / 60);
    var seconds = Math.floor(digits % 3600 % 60);

    return ( (hours > 0 ? hours + ":" + (minutes < 10 ? "0" : "") : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds );

}

export default Ember.Helper.helper(secondsToMinutes);
