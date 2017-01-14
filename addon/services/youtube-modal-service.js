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
    videoID: undefined,

    // SHOULD THE VIDEO MODAL BE VISIBLE?
    showVideoModal: false,

    // AT WHAT POINT SHOULD THE PLAYER BEGIN?
    startTime: 0,


    /*------------------------------------*\
      METHODS
    \*------------------------------------*/

    /**
     *
     */
    openVideoModal(item) {
        this.set('showVideoModal', true);
        this.set('videoId', item.videoId);

        if (item.startTime) {
            this.set('startTime', item.startTime);
        } else {
            this.set('startTime', 0);
        }
    },

    /**
     *
     */
    closeVideoModal() {
        this.set('showVideoModal', false);
    }

});
