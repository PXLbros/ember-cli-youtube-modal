import Ember from 'ember';

export default Ember.Controller.extend({
    showVideoModal: false,

    actions: {
        openModal() {
            this.set('showVideoModal', true);
        }
    }
});
