import Ember from 'ember';
import layout from '../templates/components/modal-video';
/*



 */
 var poll;
 var vidClock;

export default Ember.Component.extend({
    layout,

    classNames: ['modal-video'],
    classNameBindings: ['showVideoModal:is-open'],

    Player: null,

    showVideoModal: false,

    isPlaying: true,

    $progressBar: null,

    percent: null,

    init() {
        this._super(...arguments);
    },

    actions: {
        closeModal() {
            this.closeModal();
        },
        toggleVideo() {
            this.toggleVideo();
        }
    },

    closeModal() {
        this.set('showVideoModal', false);

        this.get('Player').seekTo(0);
        this.get('Player').stopVideo();
    },

    toggleVideo() {
        if (this.get('isPlaying')) {
            this.get('Player').pauseVideo();
            this.set('isPlaying', false);

            this.get('$progressBar').stop();
            Ember.run.cancel(vidClock);

        } else {
            this.get('Player').playVideo();
            this.set('isPlaying', true);
        }
    },

    animateProgressBar: function(percent) {
        var self = this;

        self.get('$progressBar').animate({
            'width': percent + '%',
        }, 100, 'linear');
    },

    handleVideoState: function(state) {
        var self = this;

        var $progressBar = $('.progress');
        self.set('$progressBar', $progressBar);

        var seeking = false;

        if (state === 1) {

            var duration = self.get('Player').getDuration();

            function progresser() {
                if ((state === 1) && (seeking === false)) {
                    var time = self.get('Player').getCurrentTime();
                    var percent = (time / duration) * 100;

                    console.log(percent);

                    self.set('percent', percent);

                    self.get('animateProgressBar').call(self, percent);
                }

                poll();
            }

            poll = function() {
                vidClock = Ember.run.later(progresser, 100);
            }

            poll();

        }
    },

    didInsertElement: function() {

    },

    playVideo: function() {

        Ember.run.scheduleOnce('afterRender', this, function() {

            var self = this;

            if (this.get('Player') !== null && this.get('showVideoModal') === true) {
                this.get('Player').playVideo();
                this.set('isPlaying', true);
            }

            if (this.get('Player') === null) {

                // get the passed in video id
                let videoId = this.get('videoId');

                let self = this;

                let player = new YT.Player('player', {
                    width: 1280,
                    height: 720,
                    videoId: videoId,
                    playerVars: { 'controls': 0 },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });

                this.set('Player', player);

                function onPlayerReady(event) {
                    event.target.setVolume(100);
                    event.target.playVideo();
                    self.set('isPlaying', true);

                }

                function onPlayerStateChange(event) {
                    if (event.data === YT.PlayerState.PLAYING) {

                    } else if (event.data === YT.PlayerState.ENDED) {
                        // When the youtube video has ended, close the modal
                        self.closeModal();
                    }

                    self.get('handleVideoState').call(self, event.data);
                }

            } // end if this.get('player') === null


        }); // end afterRender

    }.observes('showVideoModal'),

    willDestroyElement: function() {
        this._super(...arguments);
    }

});
