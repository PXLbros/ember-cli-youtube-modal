import Ember from 'ember';

export function pauseIcon(params/*, hash*/) {

    if (params[0] === undefined) {
        return '';
    } else {
        return '<div class="yt-toggle-icon mod-pause">' + params + '</div>';
    }

}

export default Ember.Helper.helper(pauseIcon);
