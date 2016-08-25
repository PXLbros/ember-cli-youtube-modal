import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['videos-gallery'],

    actions: {
        openModal(id) {
            console.log(this.get('videos')[0].id);
            this.get('openModal')(id);
        }
    }

});
