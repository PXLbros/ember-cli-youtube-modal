import Ember from 'ember';

export default Ember.Controller.extend({

    showVideoModal: false,
    videoId: null,

    listOfVideos: {
        "gleason": "WgkQU32XSFQ",
        "mothersday": "2BPr217zLps",
        "bleedforthis": "LiDO_sP00uk"
    },

    actions: {
        openModal(listOfVideos, videoId) {
            this.set('showVideoModal', true);
            this.set('videoId', listOfVideos[videoId]);
        }
    },

});
