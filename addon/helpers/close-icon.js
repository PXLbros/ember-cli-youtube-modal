import Ember from 'ember';

export function closeIcon(params/*, hash*/) {

    if (params[0] === undefined) {
        // Default close modal icon
        return '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.06 31.06"><line x1="0.53" y1="0.53" x2="30.53" y2="30.53" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:1.5px"/><line x1="0.53" y1="30.53" x2="30.53" y2="0.53" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:1.5px"/></svg>';
    } else {
        return params;
    }

}

export default Ember.Helper.helper(closeIcon);
