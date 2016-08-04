import Ember from 'ember';

const {
  set
} = Ember;


let daVideos = [
    {
        src: "assets/images/gallery/gleason_gallery_1.jpg",
        thumbnailSrc: "assets/images/gallery/thumbnails/gleason_gallery_thumbnail_1.jpg",
        w: 1920,
        h: 1080
    },
    {
        src: "assets/images/gallery/gleason_gallery_2.jpg",
        thumbnailSrc: "assets/images/gallery/thumbnails/gleason_gallery_thumbnail_2.jpg",
        w: 1920,
        h: 1080
    },
    {
        src: "assets/images/gallery/gleason_gallery_3.jpg",
        thumbnailSrc: "assets/images/gallery/thumbnails/gleason_gallery_thumbnail_3.jpg",
        w: 1920,
        h: 1080
    }
];

export default Ember.Route.extend({
    model() {
        return daVideos;
    }
});
