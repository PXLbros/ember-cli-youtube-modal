import Ember from 'ember';

const {
  set
} = Ember;


let listOfVideos = [
    {
        "name": "gleason",
        "id": "WgkQU32XSFQ"
    },
    {
        "name": "mothersday",
        "id": "2BPr217zLps"
    },
    {
        "name": "bleedforthis",
        "id": "LiDO_sP00uk"
    }
];

export default Ember.Route.extend({

    model() {
        return listOfVideos;
    }

});
