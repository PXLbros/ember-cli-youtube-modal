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

    // YOUTUBE ID
    videoID: undefined,

    // AT WHAT POINT SHOULD THE PLAYER BEGIN?
    startTime: 0,

    // TO KEEP TRACK OF PLAYLIST
    playerCounter: 0,

    // PLAYLIST ARRAY
    playlistArray: undefined,

    // CHECK IF A PLAYLIST IS BEING PLAYED
    isPlaylist: undefined,

    /*------------------------------------*\
      METHODS
    \*------------------------------------*/

    /**
     * @method passInYtVidAttributes
     * @param videoObject
     */
    passInYtVidAttributes(videoObject) {

        // SET THE YOUTUBE VIDEO ID
        this.set('videoId', videoObject.videoId);

        // PLAY VIDEO AT CUSTOM START TIME
        if ( videoObject.startTime ) {
            this.set('startTime', videoObject.startTime);
        } else {
            this.set('startTime', 0);
        }

    },


    /**
     * @method convertObjectToArray
     * @param item
     */
    convertObjectToArray(item) {
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

        return ytVideoArray;
    },


    /**
     * @method openVideoModal
     * @param item
     *
     * Open the Youtube Modal with passed in attributes
     *
     */
    openVideoModal(item) {

        if ( typeof item === "string" ) {

            // SET THE YOUTUBE VIDEO ID
            this.set('videoId', item);

        } else if ( typeof item === "object") {
            // IF A SINGLE VIDEO IS TRIGGERED
            if ( item.videoId ) {

                passInYtVidAttributes(item);

            } else {

            // IF A PLAYLIST IS TRIGGERED

                this.passInYtVidAttributes(this.convertObjectToArray(item)[this.playerCounter]);

            }

        }

        // SHOW VIDEO MODAL
        this.set('showVideoModal', true);

    }, // end openVideoModal


    /**
     * @method closeVideoModal
     *
     * Closes the youtube video modal
     *
     */
    closeVideoModal() {
        this.set('showVideoModal', false);
    }

});
