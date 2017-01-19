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

    videoID: undefined,

    // AT WHAT POINT SHOULD THE PLAYER BEGIN?
    startTime: 0,

    playerCounter: 0,

    playlistArray: undefined,

    isPlaylist: undefined,

    /*------------------------------------*\
      METHODS
    \*------------------------------------*/


    /**
     *
     */
    openVideoModal(item) {

        if ( typeof item === "string" ) {

            // SET THE YOUTUBE VIDEO ID
            this.set('videoId', item);


        } else if ( typeof item === "object") {
            // IF A SINGLE VIDEO IS TRIGGERED
            if ( item.videoId ) {

                // SET THE YOUTUBE VIDEO ID
                this.set('videoId', item.videoId);

                // PLAY VIDEO AT CUSTOM START TIME
                if ( item.startTime ) {
                    this.set('startTime', item.startTime);
                } else {
                    this.set('startTime', 0);
                }

            } else {

            // IF A PLAYLIST IS TRIGGERED

                // CONVERT OBJECT TO ARRAY
                let ytVideoArray = [];

                for ( let i in item ) {
                    if ( item.hasOwnProperty(i) ) {
                        ytVideoArray.push( item[i] );
                    }
                }

                // CHECK THAT THE PLAY LIST HAS MORE THAN ONE VIDEO
                if ( ytVideoArray.length > 1 ) {
                    this.set( 'isPlaylist', true );
                    this.set( 'playlistArray', ytVideoArray );
                }

                // SET THE YOUTUBE VIDEO ID
                this.set('videoId', ytVideoArray[this.playerCounter].videoId);

                // PLAY VIDEO AT CUSTOM START TIME
                if ( ytVideoArray[this.playerCounter].startTime ) {
                    this.set('startTime', ytVideoArray[this.playerCounter].startTime);
                } else {
                    this.set('startTime', 0);
                }

            }

        }

        // SHOW VIDEO MODAL
        this.set('showVideoModal', true);

    }, // end openVideoModal

    /**
     *
     */
    closeVideoModal() {
        this.set('showVideoModal', false);
    }

});
