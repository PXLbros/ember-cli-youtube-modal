import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['videos-gallery'],

    actions: {
        openModal(id) {
            this.get('openModal')(id);
        }
    }

});
