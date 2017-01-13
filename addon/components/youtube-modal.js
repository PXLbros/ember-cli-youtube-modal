import Ember from 'ember';
import layout from '../templates/components/youtube-modal';

export default Ember.Component.extend({
    layout,
    /*------------------------------------*\
      ELEMENT ATTRIBUTES
    \*------------------------------------*/
    classNames: ['youtube-modal'],
    classNameBindings: ['showVideoModal:is-open'],

    /*------------------------------------*\
      SERVICES
    \*------------------------------------*/
    youtubeModalService: Ember.inject.service('youtube-modal-service'),


    /*------------------------------------*\
      INIT
    \*------------------------------------*/
    init() {
        this._super(...arguments);

        // Handle the prefixing of the visibilitychange API
        this.get('prefixVisibilityChange').call(this);

        // Handle page visibility change
        document.addEventListener(this.get('visibilityChange'), this.get('handleVisibilityChange').bind(this), false);

        let showVideoModal = this.get('youtubeModalService').showVideoModal;

        this.set('showVideoModal', showVideoModal);

        // console.log(this.get('showVideoModal'));

    },


    /*------------------------------------*\
      YOUTUBE PROPERTIES
    \*------------------------------------*/
    Player: null,
    videoId: null,
    startTime: null,


    /*------------------------------------*\
      SELECTORS
    \*------------------------------------*/
    $progressContainer: null,
    $progressBar: null,
    $ytDuration: null,


    /*------------------------------------*\
      STATE
    \*------------------------------------*/

    // THE X POSITION OF THE YOUTUBE PROGRESS BAR
    xPos: 0,

    // SHOULD THE VIDEO MODAL BE VISIBLE?
    showVideoModal: false,

    // IS THE VIDEO PLAYING?
    isPlaying: true,

    // THE PROGRESS PERCENTAGE
    percent: null,

    // PLAYER VIDEO LENGTH
    duration: null,

    // PLAYER VIDEO ELAPSED
    time: 0,

    // IS THE PROGRESS BAR BEING DRAGGED/SCRUBBED?
    isDragging: false,

    // DID THE USER MANUALLY PAUSE THE VIDEO?
    isManualStop: false,

    // TRACK IF PAGE IS VISIBLE OR HIDDEN
    isHidden: null,

    // VENDOR PREFIXED HIDDEN API
    hidden: null,

    // VENDOR PREFIXED VISIBILITYCHANGE API
    visibilityChange: null,

    // IS THE OVERLAY ENABLED OR DISABLED?
    videoOverlay: true,

    // PROGRESS OF THE VIDEO PLAYER
    vidClock: undefined,

    // POLLING FOR `vidClock` CHANGES
    poll: undefined,

    // ARE CUSTOM CONTROLS ENABLED OR DISABLED?
    getCustomControls: function() {
        var self = this;

        // YOUTUBE API CONTROLS ACCEPTS 0 AND 1
        // IF CUSTOMCONTROLS IS SET TO `true`, THEN HIDE THE DEFAULT CONTROLS
        // IF `false`, THEN REVEAL THE DEFAULT CONTROLS
        if (self.get('customControls') === true) {
            return 0;
        } else {
            return 1;
        }
    },


    /*------------------------------------*\
      ACTIONS
    \*------------------------------------*/
    actions: {
        closeModal() {
            this.closeModal();
        },
        toggleVideo() {
            this.toggleVideo();
        }
    },


    /*------------------------------------*\
      METHODS
    \*------------------------------------*/
    // PERFORM A BROWSER CHECK TO HANDLE PREFIXING FOR THE VISIBILITYCHANGE API
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

    // DETECT WHEN THE PAGE IS VISIBLE OR HIDDEN
    handleVisibilityChange() {

        let self = this;

        // IF THE DOCUMENT IS HIDDEN
        if (document[this.get('hidden')]) {
            // If the modal is visible
            if ( self.get('showVideoModal') ) {
                // IF THE MODAL IS VISIBLE
                self.get('Player').pauseVideo();
                self.set('isPlaying', false);

                // PAUSE THE CUSTOM CONTROL PROGRESS BAR
                self.get('$progressBar').stop();
                Ember.run.cancel(self.vidClock);

                // SET PAGE VISIBILITY TO HIDDEN
                self.set('isHidden', true);
            }

        // IF THE DOCUMENT IS VISIBLE
        } else {
            // IF THE MODAL IS VISIBLE
            if (self.get('showVideoModal')) {

                // IF THE USER DIDN'T MANUALLY PAUSED/STOPPED THE VIDEO
                if ( !self.get('isManualStop') ) {
                    // PLAY THE VIDEO
                    self.get('Player').playVideo();
                    self.set('isPlaying', true);
                }

                // SET PAGE VISIBILITY TO VISIBLE
                self.set('isHidden', false);

            }
        }

    }, // END handleVisibilityChange()

    // CLOSES THE VIDEO MODAL
    closeModal() {
        var self = this;

        self.set('showVideoModal', false);

        self.get('Player').seekTo(0);
        self.get('Player').stopVideo();

        Ember.run.cancel(self.vidClock);

        // DESTROY ANY PREEXISTING YOUTUBE PLAYER OBJECT AND SET THE PLAYER PROPERTY TO NULL SO THAT FUTURE PLAYERS CAN BE INSTANTIATED
        self.get('Player').destroy();
        self.set('Player', null);

        // RESET THE PROGRESS BAR
        Ember.run.later(function() {
            self.get('$progressBar').removeAttr('style');
            self.set('time', 0);
            self.set('duration', 0);

            Ember.$('.yt-overlay').removeAttr('style');
        }, 500);

    },

    // OPENS OR CLOSES THE VIDEO MODAL
    toggleVideo() {
        var self = this;

        if (self.get('isPlaying')) {
            self.get('Player').pauseVideo();
            self.set('isPlaying', false);

            self.get('$progressBar').stop();
            Ember.run.cancel(self.vidClock);
        } else {
            self.get('Player').playVideo();
            self.set('isPlaying', true);
        }
    },

    // INITIALIZE SELECTORS
    initializeSelectors: function() {
        var self = this;

        var $progressContainer = Ember.$('.progress-container');
        var $progressBar = Ember.$('.progress');
        var $ytDuration = Ember.$('.yt-duration');

        self.set('$progressContainer', $progressContainer);
        self.set('$progressBar', $progressBar);
        self.set('$ytDuration', $ytDuration);

    },

    // DETECT IF CLICK IS LEFT BUTTON
    detectLeftButton: function(event) {
        if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    },

    // FOR PROGRESS BAR ANIMATION
    animateProgressBar: function(percent, speed, scrubbing) {
        var self = this;

        self.get('$progressBar').animate({
            'width': percent + '%',
        }, speed, 'linear', function() {

            if (scrubbing) {
                Ember.run.later(function() {
                    self.get('Player').playVideo();
                }, 150);
            }

        });
    },

    // WHEN THE USER MANUALLY SCRUBS THE PROGRESS BAR
    scrubProgressBar: function() {
        var self = this;

        self.set('xPos', ( (event.pageX - self.get('$progressContainer').offset().left) / self.get('$progressContainer').width() ) * 100);

        self.get('Player').seekTo( self.get('xPos') * (self.get('duration') / 100) );

        self.get('$progressBar').stop();
        Ember.run.cancel(self.vidClock);

        self.get('animateProgressBar').call(self, self.get('xPos'), 0, true);

    },

    // FOR PROGRESS BAR LOGIC
    handleVideoState: function(state) {
        let self = this;

        if (state === 1) {

            function progresser() {
                if (state === 1 && self.get('Player') !== null) {
                    self.set('time', self.get('Player').getCurrentTime());

                    self.set('percent', (self.get('time') / self.get('duration')) * 100);

                    self.get('animateProgressBar').call(self, self.get('percent'), 100);
                }

                self.poll();

            }

            self.poll = function() {
                self.vidClock = Ember.run.later(progresser, 100);
            }

            self.poll();

        }
    },

    // FOR PROGRESS BAR SCRUBBING
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
                // CHANGE THE PROGRESS NUMBER AS YOU SCRUB THE PROGRESS BAR
                self.set('time', Math.floor(self.get('xPos') * (self.get('duration') / 100)));
            }

        });

        self.get('$progressContainer').on('mouseup', function(event) {
            self.set('isDragging', false);

        });

    },

    // WHEN THE `Player` STARTS
    onPlayerReady: function(event) {
        var self = this;

        event.target.setVolume(100);
        event.target.playVideo();
        self.set('isPlaying', true);

        self.set('duration', self.get('Player').getDuration() - 1);

        Ember.$('.yt-overlay').delay(500).fadeOut();
    },

    // ANYTIME THE `Player` PLAYS, PAUSES, OR STOPS
    onPlayerStateChange: function(event) {
        let self = this;

        if (event.data === YT.PlayerState.PLAYING) {
            self.set('isPlaying', true);

            // IF THE THE PAGE HASN'T BEEN HIDDEN BY PAGE VISIBILITY CHANGE EVENT AND THE USER MANUALLY TURNED ON THE VIDEO, THEN SET `isManualStop` TO `false`
            if ( !self.get('isHidden')) {
                self.set('isManualStop', false);
            }

        }

        else if (event.data === YT.PlayerState.PAUSED) {
            self.get('$progressBar').stop();
            Ember.run.cancel(self.vidClock);

            self.set('isPlaying', false);

            // IF THE THE PAGE HAS BEEN HIDDEN BY PAGE VISIBILITY CHANGE EVENT AND THE USER MANUALLY TURNED ON THE VIDEO, THEN SET `isManualStop` TO `true`
            if ( !self.get('isHidden')) {
                self.set('isManualStop', true);
            }

        }

        else if (event.data === YT.PlayerState.ENDED) {
            // WHEN THE YOUTUBE VIDEO HAS ENDED, CLOSE THE MODAL
            self.closeModal();
        }

        self.get('handleVideoState').call(self, event.data);

    },

    // THIS METHOD WILL RUN IF THE `showVideoModal` PROPERTY CHANGES
    startVideo: Ember.observer('showVideoModal', function() {
        Ember.run.scheduleOnce('afterRender', () => {

            var self = this;

            // GET THE PASSED IN VIDEO ID
            let videoId = self.get('videoId');
            let startTime = self.get('startTime');
            let Player;

            // IF THE YOUTUBE PLAYER HASN'T BEEN INITIALIZED
            if (self.get('Player') === null && self.get('showVideoModal')) {

                // CREATE AN INSTANCE OF THE YOUTUBE PLAYER / AKA INITIALIZE THE YOUTUBE PLAYER
                Player = new YT.Player('player', {
                    width: self.get('width'),
                    height: self.get('height'),
                    videoId: videoId,
                    playerVars: {
                        'controls': self.get('getCustomControls').call(self),
                        'start': startTime
                    },
                    events: {
                        'onReady': self.get('onPlayerReady').bind(self),
                        'onStateChange': self.get('onPlayerStateChange').bind(self)
                    }
                });

                self.set('Player', Player);

            } // end if this.get('player') === null

        }); // end afterRender
    }),


    /*------------------------------------*\
      DID INSERT ELEMENT
    \*------------------------------------*/
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', () => {

            // INITIALIZE SELECTORS
            this.initializeSelectors();

            // INITIALIZE PROGRESS BAR SCRUBBING
            this.dragging();

            // PLAY VIDEO IF 'showVideoModal' IS SET TO TRUE
            this.startVideo();

        }); // END `afterRender`
    }, // END `didInsertElement`


    /*------------------------------------*\
      WILL DESTROY ELEMENT
    \*------------------------------------*/
    willDestroyElement: function() {
        this._super(...arguments);
        // CLOSE THE MODAL IF THE ELEMENT IS DESTROYED
        this.closeModal();
    }

}); // END `Ember.Component.extend`
