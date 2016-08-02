import Ember from 'ember';

export function toggleIcon(params/*, hash*/) {

    if (params[0] === undefined) {
        return
            `<div class="yt-toggle-icon-default">
                <div class="left"></div>
                <div class="right"></div>
                <div class="triangle-1"></div>
                <div class="triangle-2"></div>
            </div>`;
    } else {
        return params;
    }

}

export default Ember.Helper.helper(toggleIcon);
