import Ember from 'ember';

export default Ember.Service.extend({

    /*------------------------------------*\
      INIT
    \*------------------------------------*/
    init() {
    },


    /*------------------------------------*\
      PROPERTIES
    \*------------------------------------*/
    // SHOULD THE VIDEO MODAL BE VISIBLE?
    showVideoModal: false,


    /*------------------------------------*\
      METHODS
    \*------------------------------------*/

    toggleVideoModal() {
        this.toggleProperty('showVideoModal');
    },

    openVideoModal() {
        this.set('showVideoModal', true);
    },

    closeVideoModal() {
        this.set('showVideoModal', false);
    }

});
