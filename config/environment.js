/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
    return {
        youtubeModalServiceDefaults: {
            injectionFactories: ['controller', 'view', 'component']
        }
    };
};
