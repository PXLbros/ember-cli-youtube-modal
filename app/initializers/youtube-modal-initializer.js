import youtubeModalService from 'ember-cli-youtube-modal/services/youtube-modal-service';
import config from '../config/environment';

export function initialize( application ) {
    // application.inject('route', 'foo', 'service:foo');

    const { youtubeModalServiceDefaults } = config;
    const { injectionFactories } = youtubeModalServiceDefaults;


    injectionFactories.forEach(factory => {
        application.inject(factory, 'youtubeModalService', 'service:youtubeModalService');
    });


}

export default {
  name: 'youtube-modal-initializer',
  initialize
};
