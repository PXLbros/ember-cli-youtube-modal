import Ember from 'ember';

export default Ember.Controller.extend({

    /*------------------------------------*\
      SERVICES
    \*------------------------------------*/
    youtubeModalService: Ember.inject.service('youtube-modal-service'),

    listOfYtVideos: {
        "gleason": {
            videoId: "WgkQU32XSFQ",
            startTime: 40,
            title: "Gleason Trailer",
        },
        "mothersday": {
            videoId: "2BPr217zLps",
            title: "Mother's Day Trailer"
        },
        "bleedforthis": {
            videoId: "zQ6ny-fROX8",
            title: "Bleed For This Trailer"
        }
    },


    actions: {
        openModal(item) {
            this.get('youtubeModalService').openVideoModal(item);
        }
    }

});
