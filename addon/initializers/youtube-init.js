export function initialize(application) {
    // application.inject('route', 'foo', 'service:foo');

    // Delay application loading until all of the following promises are resolved
    application.deferReadiness();

    let promises = [];

    // Load yt script
    promises.push(new Ember.RSVP.Promise((res, rej) => {

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // when onYouTubeIframeAPIReady is ready, resolve the promise
        window.onYouTubeIframeAPIReady = res;

    }));

    // Load application once promises are resolved
    return Ember.RSVP.Promise.all(promises).then(()=>{
        application.advanceReadiness();
    });

}

export default {
    name: 'youtube-init',
    initialize
};
