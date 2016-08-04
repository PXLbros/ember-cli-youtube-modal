import Ember from 'ember';

export default Ember.Controller.extend({

    showVideoModal: false,

    listOfVideos: {
        "gleason": "WgkQU32XSFQ",
        "mothersday": "2BPr217zLps",
        "bleedforthis": "LiDO_sP00uk"
    },

    actions: {
        openModal(listOfVideos, videoId) {
            this.set('showVideoModal', true);
            this.set('videoId', listOfVideos[videoId]);
        },

        galleryOpenModal(id) {
            this.set('showVideoModal', true);
            this.set('videoId', id);
        }
    },

    init() {
        this._super(...arguments);

        // console.log(this.get('test'));
    },

    test: Ember.computed('model', function() {
        let videos = this.get('model');
        return videos;
    })

});
