import Ember from 'ember';

export default Ember.Controller.extend({

    applicationController: Ember.inject.controller('application'),
    daApplicationController: Ember.computed.reads('applicationController'),

    actions: {
        openModal(id) {
            this.get('daApplicationController').set('showVideoModal', true);
            this.get('daApplicationController').set('videoId', id);
        }
    }

});
