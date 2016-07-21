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
            // console.log('stop');

        } else {
            this.get('Player').playVideo();
            this.set('isPlaying', true);
        }
    },


    /*
     * Functions / Methods
     */
    initializeSelectors: function() {
        var $progressContainer = Ember.$('.progress-container');

        this.set('$progressContainer', $progressContainer);

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

        if (state === 1) {

            function progresser() {
                if (state === 1) {
                    self.set('time', self.get('Player').getCurrentTime());

                    self.set('percent', (self.get('time') / self.get('duration')) * 100);

                    self.get('animateProgressBar').call(self, self.get('percent'));

                    // console.log(self.get('percent'));
                }

                poll();
            }

            poll = function() {
                vidClock = Ember.run.later(progresser, 100);
            }

            poll();

        }
    },

    dragging: function() {

        var self = this;

        var progressContainerWidth = self.get('$progressContainer').width();

        var xPos;


        self.get('$progressContainer').on('mousedown', function(event) {

            self.set('isDragging', true);

            xPos = ( (event.pageX - $(this).offset().left) / progressContainerWidth ) * 100;

            self.get('Player').seekTo( xPos * (self.get('duration') / 100) );

            self.get('$progressBar').stop();
            Ember.run.cancel(vidClock);

            self.get('$progressBar').animate({
                'width': xPos + '%',
            }, 0, 'linear');

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

    playVideo: function() {

        Ember.run.scheduleOnce('afterRender', this, function() {

            var self = this;

            if (this.get('Player') !== null && this.get('showVideoModal') === true) {
                this.get('Player').playVideo();
                this.set('isPlaying', true);

                self.get('handleVideoState').call(self, event.data);
            }

            if (this.get('Player') === null) {

                // get the passed in video id
                let videoId = this.get('videoId');

                let Player = new YT.Player('player', {
                    width: 1280,
                    height: 720,
                    videoId: videoId,
                    playerVars: { 'controls': 0 },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });

                self.set('Player', Player);

                function onPlayerReady(event) {
                    event.target.setVolume(100);
                    event.target.playVideo();
                    self.set('isPlaying', true);

                    self.set('duration', Player.getDuration() - 1);
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


    /*
     * didInsertElement
     */
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            // Initialize selectors
            this.get('initializeSelectors').call(this);

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
