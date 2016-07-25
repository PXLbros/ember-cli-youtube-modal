import Ember from 'ember';
import layout from '../templates/components/modal-video';


var poll;
var vidClock;

export default Ember.Component.extend({
    layout,

    classNames: ['modal-video'],

    classNameBindings: ['showVideoModal:is-open'],

    Player: null,

    videoId: null,


    /*
     * Selectors
     */
    $progressContainer: null,

    $progressBar: null,


    /*
     * State
     */
    showVideoModal: false,

    isPlaying: true,

    percent: null,

    duration: null,

    time: 0,

    ticking: true,

    isDragging: false,

    /*
     * Init
     */
    init() {
        this._super(...arguments);


    },


    /*
     * Actions
     */
    actions: {
        closeModal() {
            this.closeModal();
        },
        toggleVideo() {
            this.toggleVideo();
        }
    },

    closeModal() {
        var self = this;

        self.set('showVideoModal', false);

        self.get('Player').seekTo(0);
        self.get('Player').stopVideo();

        Ember.run.cancel(vidClock);

        // Destroy any preexisting Youtube Player object and set the Player property to null so that future players can be instantiated
        self.get('Player').destroy();
        self.set('Player', null);



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


    /*
     * Functions / Methods
     */

    initializeSelectors: function() {
        var self = this;

        var $progressContainer = Ember.$('.progress-container');
        var $progressBar = $('.progress');

        self.set('$progressContainer', $progressContainer);
        self.set('$progressBar', $progressBar);

    },

    // Detect if click is left button
    detectLeftButton: function(evt) {
        if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    },

    // For progress bar animation
    animateProgressBar: function(percent) {
        var self = this;

        self.get('$progressBar').animate({
            'width': percent + '%',
        }, 100, 'linear');
    },

    // For progress bar logic
    handleVideoState: function(state) {
        var self = this;

        if (state === 1) {

            function progresser() {
                if (state === 1 && self.get('Player') !== null) {
                    self.set('time', self.get('Player').getCurrentTime());

                    self.set('percent', (self.get('time') / self.get('duration')) * 100);

                    self.get('animateProgressBar').call(self, self.get('percent'));
                }

                poll();

            }

            poll = function() {
                vidClock = Ember.run.later(progresser, 100);
            }

            poll();

        }
    },

    // For progress bar scrubbing
    dragging: function() {

        var self = this;

        // console.log('dragging');

        var progressContainerWidth = self.get('$progressContainer').width();

        var xPos;

        self.get('$progressContainer').on('mousedown', function(event) {

            if (self.get('detectLeftButton')(event)) {
                self.set('isDragging', true);

                xPos = ( (event.pageX - $(this).offset().left) / progressContainerWidth ) * 100;

                self.get('Player').seekTo( xPos * (self.get('duration') / 100) );

                self.get('$progressBar').stop();
                Ember.run.cancel(vidClock);

                self.get('$progressBar').animate({
                    'width': xPos + '%',
                }, 0, 'linear');
            }

        });

        self.get('$progressContainer').on('mousemove', function(event) {

            if ( self.get('isDragging') ) {
                xPos = ( (event.pageX - $(this).offset().left) / progressContainerWidth ) * 100;

                self.get('Player').seekTo( xPos * (self.get('duration') / 100) );

                self.get('$progressBar').stop();
                Ember.run.cancel(vidClock);

                self.get('$progressBar').animate({
                    'width': xPos + '%',
                }, 0, 'linear');
            }

        });

        self.get('$progressContainer').on('mouseup', function(event) {
            self.set('isDragging', false);
        });

    },

    onPlayerReady: function(event) {
        var self = this;

        event.target.setVolume(100);
        event.target.playVideo();
        self.set('isPlaying', true);

        self.set('duration', self.get('Player').getDuration() - 1);
    },

    onPlayerStateChange: function(event) {
        var self = this;

        if (event.data === YT.PlayerState.PLAYING) {
            // console.log('playing');
        }

        else if (event.data === YT.PlayerState.PAUSED) {
            self.get('$progressBar').stop();
            Ember.run.cancel(vidClock);

            // console.log('paused');
        }

        else if (event.data === YT.PlayerState.ENDED) {
            // When the youtube video has ended, close the modal
            self.closeModal();

            // console.log('ended');
        }

        self.get('handleVideoState').call(self, event.data);

    },

    // This method will run if the showVideoModal property changes
    playVideo: function() {

        Ember.run.scheduleOnce('afterRender', this, function() {

            var self = this;

            // get the passed in video id
            let videoId = self.get('videoId');
            let Player;

            // If the youtube player has already been initialized and
            // if the modal is opened
            // then play the video
            if (self.get('Player') !== null && self.get('showVideoModal') === true) {

                self.get('Player').playVideo();
                self.set('isPlaying', true);

                self.get('handleVideoState').call(self, event.data);
            }

            // If the youtube player hasn't been initialized
            if (self.get('Player') === null && self.get('showVideoModal')) {

                // console.log('new instance');

                // create an instance of the youtube player / aka initialize the youtube player
                Player = new YT.Player('player', {
                    width: self.get('width'),
                    height: self.get('height'),
                    videoId: videoId,
                    playerVars: {
                        'controls': self.get('controls')
                    },
                    events: {
                        'onReady': self.get('onPlayerReady').bind(self),
                        'onStateChange': self.get('onPlayerStateChange').bind(self)
                    }
                });

                self.set('Player', Player);

            } // end if this.get('player') === null

        }); // end afterRender

    }.observes('showVideoModal'),


    /*
     * didInsertElement
     */
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            // Initialize selectors
            this.get('initializeSelectors').call(this);

            // Initialize progress bar scrubbing
            this.get('dragging').call(this);

        });
    },

    /*
     * willDestroyElement
     */
    willDestroyElement: function() {
        this._super(...arguments);
    }

});
