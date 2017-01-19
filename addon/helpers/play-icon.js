import Ember from 'ember';

export function playIcon(params/*, hash*/) {

    if (params[0] === undefined) {
        return `<div class="yt-toggle-icon-default">
                <div class="yt-left-triangle"></div>
                <div class="yt-right-triangle"></div>
                <div class="yt-triangle-1"></div>
                <div class="yt-triangle-2"></div>
            </div>`;
    } else {
        return params;
    }

}

export default Ember.Helper.helper(playIcon);
