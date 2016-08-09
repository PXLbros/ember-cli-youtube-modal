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

    $ytDuration: null,

    /*
     * No idea
     */
     xPos: 0,

    /*
     * State
     */

     // show whether the video modal is visible or hidden
    showVideoModal: false,

    // is the video playing?
    isPlaying: true,

    // The progress percentage
    percent: null,

    // Player video length
    duration: null,

    // Player video elapsed
    time: 0,

    // Is the progress bar being dragged/scrubbed?
    isDragging: false,

    // Did the user manually pause the video?
    isManualStop: false,

    // Track if page is visible or hidden
    isHidden: null,

    // Vendor prefixed hidden API
    hidden: null,

    // Vendor prefixed visibilitychange API
    visibilityChange: null,

    // are custom controls enabled or disabled?
    getCustomControls: function() {
        var self = this;

        // Youtube API controls accepts 0 and 1
        // If customControls is set to `true, then hide the default controls
        // If `false`, then reveal the default controls
        if (self.get('customControls') === true) {
            return 0;
        } else {
            return 1;
        }
    },

    /*
     * Init
     */
    init() {
        this._super(...arguments);

        // Handle the prefixing of the visibilitychange API
        this.get('prefixVisibilityChange').call(this);

        // Handle page visibility change
        document.addEventListener(this.get('visibilityChange'), this.get('handleVisibilityChange').bind(this), false);

    },

    /*
     * Passive Methods
     */

    // Perform a browser check to handle prefixing for the visibilitychange API
    prefixVisibilityChange() {
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            this.set('hidden', 'hidden');
            this.set('visibilityChange', 'visibilitychange');
        } else if (typeof document.mozHidden !== "undefined") {
            this.set('hidden', 'mozHidden');
            this.set('visibilityChange', 'mozvisibilitychange');
        } else if (typeof document.msHidden !== "undefined") {
            this.set('hidden', 'msHidden');
            this.set('visibilityChange', 'msvisibilitychange');
        } else if (typeof document.webkitHidden !== "undefined") {
            this.set('hidden', 'webkitHidden');
            this.set('visibilityChange', 'webkitvisibilitychange');
        }
    },

    // Detect when the page is visible or hidden
    handleVisibilityChange() {

        var self = this;

        if (document[this.get('hidden')]) {

            if ( self.get('showVideoModal') ) {
                self.get('Player').pauseVideo();
                self.set('isPlaying', false);

                self.get('$progressBar').stop();
                Ember.run.cancel(vidClock);

                self.set('isHidden', true);
            }

        } else {
            if (self.get('showVideoModal')) {

                if ( !self.get('isManualStop') ) {
                    self.get('Player').startVideo();
                    self.set('isPlaying', true);
                }

                self.set('isHidden', false);

            }
        }

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

    // Closes the video modal
    closeModal() {
        var self = this;

        self.set('showVideoModal', false);

        self.get('Player').seekTo(0);
        self.get('Player').stopVideo();

        Ember.run.cancel(vidClock);

        // Destroy any preexisting Youtube Player object and set the Player property to null so that future players can be instantiated
        self.get('Player').destroy();
        self.set('Player', null);

        // Reset the progress bar
        Ember.run.later(function() {
            self.get('$progressBar').removeAttr('style');
            self.set('time', 0);
            self.set('duration', 0);

            Ember.$('.yt-overlay').removeAttr('style');
        }, 500);

    },

    // Opens or closes the video modal
    toggleVideo() {
        var self = this;

        if (self.get('isPlaying')) {
            self.get('Player').pauseVideo();
            self.set('isPlaying', false);

            self.get('$progressBar').stop();
            Ember.run.cancel(vidClock);

        } else {

                self.get('Player').startVideo();
                self.set('isPlaying', true);

        }
    },


    /*
     * Functions / Methods
     */

    initializeSelectors: function() {
        var self = this;

        var $progressContainer = Ember.$('.progress-container');
        var $progressBar = Ember.$('.progress');
        var $ytDuration = Ember.$('.yt-duration');

        self.set('$progressContainer', $progressContainer);
        self.set('$progressBar', $progressBar);
        self.set('$ytDuration', $ytDuration);

    },

    // Detect if click is left button
    detectLeftButton: function(event) {
        if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    },

    // For progress bar animation
    animateProgressBar: function(percent, speed) {
        var self = this;

        self.get('$progressBar').animate({
            'width': percent + '%',
        }, speed, 'linear');
    },

    // When the user manually scrubs the progress bar
    scrubProgressBar: function() {
        var self = this;

        self.set('xPos', ( (event.pageX - self.get('$progressContainer').offset().left) / self.get('$progressContainer').width() ) * 100);

        self.get('Player').seekTo( self.get('xPos') * (self.get('duration') / 100) );

        self.get('$progressBar').stop();
        Ember.run.cancel(vidClock);

        self.get('animateProgressBar').call(self, self.get('xPos'), 0);
    },

    // For progress bar logic
    handleVideoState: function(state) {
        var self = this;

        if (state === 1) {

            function progresser() {
                if (state === 1 && self.get('Player') !== null) {
                    self.set('time', self.get('Player').getCurrentTime());

                    self.set('percent', (self.get('time') / self.get('duration')) * 100);

                    self.get('animateProgressBar').call(self, self.get('percent'), 100);
                }

                poll();

            }

            poll = function() {
                vidClock = Ember.run.later(progresser, 100);
            };

            poll();

        }
    },

    // For progress bar scrubbing
    dragging: function() {

        var self = this;

        self.get('$progressContainer').on('mousedown', function(event) {

            if (self.get('detectLeftButton')(event)) {
                self.set('isDragging', true);
                self.get('scrubProgressBar').call(self);
            }

        });

        self.get('$progressContainer').on('mousemove', function(event) {

            if ( self.get('isDragging') ) {
                self.get('scrubProgressBar').call(self);
                // Change the progress number as you scrub the progress bar
                self.set('time', Math.floor(self.get('xPos') * (self.get('duration') / 100)));
            }

        });

        self.get('$progressContainer').on('mouseup', function(event) {
            self.set('isDragging', false);

        });

    },

    // When the Player starts
    onPlayerReady: function(event) {
        var self = this;

        event.target.setVolume(100);
        event.target.startVideo();
        self.set('isPlaying', true);

        self.set('duration', self.get('Player').getDuration() - 1);

        Ember.$('.yt-overlay').delay(500).fadeOut();
    },

    // Anytime the Player plays, pauses, or stops
    onPlayerStateChange: function(event) {
        var self = this;

        if (event.data === YT.PlayerState.PLAYING) {
            self.set('isPlaying', true);

            // If the the page hasn't been hidden by page visibility change event and the user manually turned on the video, then set `isManualStop` to false
            if ( !self.get('isHidden')) {
                self.set('isManualStop', false);
            }

        }

        else if (event.data === YT.PlayerState.PAUSED) {
            self.get('$progressBar').stop();
            Ember.run.cancel(vidClock);

            self.set('isPlaying', false);

            // If the the page has been hidden by page visibility change event and the user manually turned on the video, then set `isManualStop` to true
            if ( !self.get('isHidden')) {
                self.set('isManualStop', true);
            }

        }

        else if (event.data === YT.PlayerState.ENDED) {
            // When the youtube video has ended, close the modal
            self.closeModal();
        }

        self.get('handleVideoState').call(self, event.data);

    },

    // This method will run if the showVideoModal property changes
    startVideo: function() {

        Ember.run.scheduleOnce('afterRender', this, function() {

            var self = this;

            // get the passed in video id
            let videoId = self.get('videoId');
            let Player;

            // If the youtube player hasn't been initialized
            if (self.get('Player') === null && self.get('showVideoModal')) {

                // create an instance of the youtube player / aka initialize the youtube player
                Player = new YT.Player('player', {
                    width: self.get('width'),
                    height: self.get('height'),
                    videoId: videoId,
                    playerVars: {
                        'controls': self.get('getCustomControls').call(self)
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

            var self = this;

            // Initialize selectors
            this.get('initializeSelectors').call(this);

            // Initialize progress bar scrubbing
            this.get('dragging').call(this);

            // Play Video if showVideoModal is set to true
            self.get('startVideo').call(self);

        });
    },

    /*
     * willDestroyElement
     */
    willDestroyElement: function() {
        this._super(...arguments);

        this.closeModal();
    }

});
