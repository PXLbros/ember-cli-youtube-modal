import Ember from 'ember';
import layout from '../templates/components/youtube-modal';
import detectLeftClick from 'ember-cli-youtube-modal/utils/detect-left-click';
import prefixVisibilityChange from 'ember-cli-youtube-modal/utils/prefix-visibility-change';

export default Ember.Component.extend({layout,
    /*------------------------------------*\
      INIT
    \*------------------------------------*/
    init() {
        this._super(...arguments);

        // Handle the prefixing of the visibilitychange API
        this.get('prefixVisibilityChange').call(this);

        // Handle page visibility change
        document.addEventListener(this.get('visibilityChange'), this.get('handleVisibilityChange').bind(this), false);


        let configObject = Ember.getOwner(this).resolveRegistration('config:environment');
        this.set('configObject', configObject);

        this.get('youtubeModalService');


    },

    /*------------------------------------*\
      ELEMENT ATTRIBUTES
    \*------------------------------------*/
    classNames: ['youtube-modal'],
    classNameBindings: ['youtubeModalService.showVideoModal:is-open'],

    /*------------------------------------*\
      SERVICES
    \*------------------------------------*/
    youtubeModalService: Ember.inject.service('youtube-modal-service'),





    /*------------------------------------*\
      VARIABLES
    \*------------------------------------*/
    configObject: null,


    /*------------------------------------*\
      YOUTUBE PROPERTIES
    \*------------------------------------*/
    Player: null,


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

    // IS THE VIDEO PLAYING?
    isPlaying: true,

    // THE PROGRESS PERCENTAGE
    percent: null,

    // PLAYER VIDEO LENGTH
    duration: null,

    // PLAYER VIDEO ELAPSED
    elapsedTime: 0,

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
            if ( self.get('youtubeModalService.showVideoModal') ) {
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
            if (self.get('youtubeModalService.showVideoModal')) {

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

    // CLEAN UP VIDEO SCRUB
    cleanUpScrub() {
        let self = this;

        self.get('Player').seekTo(0);
        self.get('Player').stopVideo();

        // Ember.run.cancel(self.vidClock);

        // DESTROY ANY PREEXISTING YOUTUBE PLAYER OBJECT AND SET THE PLAYER PROPERTY TO NULL SO THAT FUTURE PLAYERS CAN BE INSTANTIATED
        self.get('Player').destroy();
        self.set('Player', null);

        Ember.run.cancel(self.vidClock);

        // RESET THE PROGRESS BAR
        Ember.run.later(function() {
            self.get('$progressBar').removeAttr('style');
            self.set('elapsedTime', 0);
            self.set('duration', 0);

            Ember.$('.yt-overlay').removeAttr('style');
        }, 500);


    },

    // CLOSES THE VIDEO MODAL
    closeModal() {
        let self = this;

        self.set('youtubeModalService.showVideoModal', false);

        self.set('youtubeModalService.playerCounter', 0);

        self.set('youtubeModalService.isPlaylist', false);

        self.cleanUpScrub();

        self.turnOffAdaptiveVid();
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

        let $progressContainer = Ember.$('.progress-container');
        let $progressBar = Ember.$('.progress-bar');
        let $ytDuration = Ember.$('.yt-duration');

        self.set('$progressContainer', $progressContainer);
        self.set('$progressBar', $progressBar);
        self.set('$ytDuration', $ytDuration);

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

    // SET THE VALUE OF THE ELAPSED TIME AND EXECUTE THE ANIMATED REPRESENTATION OF THE ELAPSED TIME
    setVideoProgress: function(state) {
        let self = this;

        // MAKE SURE PLAYER INSTANCE EXISTS AND THAT IT'S PLAYING
        if ( self.get('Player') !== null && state === 1 ) {

            // MAKE SURE ELAPSED TIME NEVER EXCEEDS THE DURATION
            if ( (self.get('duration') + 1) >=  self.get('Player').getCurrentTime() ) {
                self.set( 'elapsedTime', self.get('Player').getCurrentTime() );
                // console.log(self.get('elapsedTime'));
                // console.log(self.get('duration'));
                self.set( 'percent', ( self.get('elapsedTime') / self.get('duration') ) * 100 );
                self.get( 'animateProgressBar' ).call( self, self.get('percent'), 100 );
            }

        }

        // POLL PROGRESS
        self.pollProgress(state);
    },

    // POLL `setVideoProgress()`
    pollProgress: function(state) {
        let self = this;

        self.vidClock = Ember.run.later(function() {
            self.setVideoProgress(state);
        }, 100);

    },

    // HANDLE THE STATE OF THE VIDEO
    handleVideoState: function(state) {
        let self = this;

        if (state === 1) {
            self.pollProgress(state);
        }
    },

    // FOR PROGRESS BAR SCRUBBING
    dragging: function() {

        var self = this;

        self.get('$progressContainer').on('mousedown', function(event) {

            if (detectLeftClick(event)) {
                self.set('isDragging', true);
                self.get('scrubProgressBar').call(self);
            }

        });

        self.get('$progressContainer').on('mousemove', function(event) {

            if ( self.get('isDragging') ) {
                self.get('scrubProgressBar').call(self);
                // CHANGE THE PROGRESS NUMBER AS YOU SCRUB THE PROGRESS BAR
                self.set('elapsedTime', Math.floor(self.get('xPos') * (self.get('duration') / 100)));
            }

        });

        self.get('$progressContainer').on('mouseup', function(event) {
            self.set('isDragging', false);

        });

    },

    // WHEN THE `Player` STARTS
    onPlayerReady: function(event) {
        var self = this;

        // TURN UP THE VOLUMN
        event.target.setVolume(100);
        // PLAY THE VIDEO
        event.target.playVideo();
        // KEEP TRACK OF THE PLAY SATE
        self.set('isPlaying', true);
        // GET THE DURATION OF THE VIDEO
        self.set( 'duration', self.get('Player').getDuration() - 1 );
        // FADE OUT THE OVERLAY (OVERLAY IS TO HIDE THE FLASHING THUMBNAIL);
        Ember.$('.yt-overlay').delay(500).fadeOut();

        // FLUID VIDEO
        self.turnOnAdaptiveVid();
    },

    // ANYTIME THE `Player` PLAYS, PAUSES, OR STOPS
    onPlayerStateChange: function(event) {
        let self = this;

        // WHEN THE YOUTUBE VIDEO IS PLAYING
        if (event.data === YT.PlayerState.PLAYING) {
            self.set('isPlaying', true);

            // IF THE THE PAGE HASN'T BEEN HIDDEN BY PAGE VISIBILITY CHANGE EVENT AND THE USER MANUALLY TURNED ON THE VIDEO, THEN SET `isManualStop` TO `false`
            if ( !self.get('isHidden')) {
                self.set('isManualStop', false);
            }

        }

        // WHEN THE YOUTUBE PLAYER IS PAUSED
        else if (event.data === YT.PlayerState.PAUSED) {
            self.get('$progressBar').stop();
            Ember.run.cancel(self.vidClock);

            self.set('isPlaying', false);

            // IF THE THE PAGE HAS BEEN HIDDEN BY PAGE VISIBILITY CHANGE EVENT AND THE USER MANUALLY TURNED ON THE VIDEO, THEN SET `isManualStop` TO `true`
            if ( !self.get('isHidden')) {
                self.set('isManualStop', true);
            }

        }

        // WHEN THE YOUTUBE PLAYER HAS ENDED
        else if (event.data === YT.PlayerState.ENDED) {
            // WHEN THE YOUTUBE VIDEO HAS ENDED, CLOSE THE MODAL
            if ( !self.get('youtubeModalService.isPlaylist') ) {
                self.closeModal();
            } else {

                self.incrementProperty( 'youtubeModalService.playerCounter' );

                // IF THE LENGTH OF THE `playlistArray` IS GREATER THAN THE COUNTER
                if (self.get('youtubeModalService.playlistArray').length > self.get('youtubeModalService.playerCounter') ) {

                    // CLEAN UP SCRUB FOR NEXT VIDEO
                    self.cleanUpScrub();

                    // SET THE `videoId` EQUAL TO THE QUEUED VIDEO
                    self.set('youtubeModalService.videoId', self.get('youtubeModalService.playlistArray')[self.get('youtubeModalService.playerCounter')].videoId);

                    // IF THE QUEUED VIDEO HAS A `startTime` PROPERTY DEFIEND
                    if ( self.get('youtubeModalService.playlistArray')[self.get('youtubeModalService.playerCounter')].startTime ) {
                        self.set('youtubeModalService.startTime', self.get('youtubeModalService.playlistArray')[self.get('youtubeModalService.playerCounter')].startTime);
                    } else {
                    // IF NO CUSTOM `startTime` THEN JUST START FROM 0
                        self.set('youtubeModalService.startTime', self.get('youtubeModalService.playlistArray')[self.get('youtubeModalService.playerCounter')].startTime);
                    }

                    // START THE VIDEO
                    self.startVideo();
                } else {
                // IF `playerCounter` IS GREATER THAN `playlistArray` AKA THE LAST VIDEO IN THE ARRAY IS REACHED, TEHN CLOSE THE MODAL
                    self.closeModal();
                }

            }

        }

        self.get('handleVideoState').call(self, event.data);

    },

    // THIS METHOD WILL RUN IF THE `showVideoModal` PROPERTY CHANGES
    startVideo: Ember.observer('youtubeModalService.showVideoModal', function() {
        Ember.run.scheduleOnce('afterRender', () => {

            var self = this;

            // GET THE PASSED IN VIDEO ID
            let videoId = self.get('youtubeModalService.videoId');

            // GET THE PASSED IN START TIME
            let startTime = self.get('youtubeModalService.startTime');

            // YOUTUBE PLAYER INSTANCE HOLDER
            let Player;

            // IF THE YOUTUBE PLAYER HASN'T BEEN INITIALIZED
            if ( self.get('Player') === null && self.get('youtubeModalService.showVideoModal') ) {

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

                // SET THE `Player` KEY TO BE THE YOUTUBE PLAYER INSTANCE
                self.set('Player', Player);

            } // end if this.get('player') === null



        }); // end afterRender
    }),

    $adaptiveEl: Ember.$(window),

    turnOnAdaptiveVid: function() {
        let self = this;
        let $youtubeIframe = Ember.$('.youtube-modal iframe');

        $youtubeIframe.each(function() {
            Ember.$(this)
                .attr( 'data-aspectratio', this.height / this.width )
                .removeAttr('height width')
        });

        this.$adaptiveEl.on('resize.ytModal', function() {

            let newWidth = self.$adaptiveEl.width();

            // console.log(newWidth);

            $youtubeIframe.each(function() {
                let $thisEl = Ember.$(this);
                $thisEl
                    .width(newWidth)
                    .height(newWidth * $thisEl.attr('data-aspectratio'));

            });

        }).trigger('resize');

    },

    turnOffAdaptiveVid: function() {
        this.$adaptiveEl.off('resize.ytModal');
    },

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
