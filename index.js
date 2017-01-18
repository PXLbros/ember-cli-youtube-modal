/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-youtube-modal',

  contentFor: function( type, config ) {
    if ( type === "body-footer" ) {
        return `
            <script type="text/javascript">
                var tag = document.createElement('script');
                tag.id = 'iframe-demo';
                tag.src = 'https://www.youtube.com/iframe_api';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            </script>
        `;
    }
  }
};
