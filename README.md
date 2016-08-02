# Ember-cli-video-modal

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).

## API

### showVideoModal
### videoId

### width
### height
### customControls

### closeIcon
### durationDivider
### playIcon
### pauseIcon


# How To Use Youtube-Modal 

## initial Setup

In your Ember app's root directory run

`npm install ember-cli-youtube-modal --save`

Once the addon is installed, the component `{{modal-video}}` will become available to your Ember App. 

But before you can use the addon, you must do some initial setup work In your component's parent controller, ideally in the `application.js` controller.

First you define a `showVideoModal` property and set it to be `false`.

```
// application.js
showVideoModal: false
```

Then pass the property down to your `{{modal-video}}` component.

```
// application.hbs
{{modal-video
    showVideoModal = showVideoModal
}}
```

Next you define a `videoId` property whose value is the id of your YouTube video.

```
// application.js
videoId: <Your YouTube Video ID>
```

Then likewise pass the property down to your `{{modal-video}}` component.

```
// application.hbs
{{modal-video
    showVideoModal = showVideoModal  
    ***videoId=videoId***
}}
```

That's it for the initial setup.

## How To Open And Play YouTube-Modal

To open and play after the page loads set `showVideoModal` to `true` in the `init()` function.

```
// application.js
init() {
    this._super(...arguments);

    this.set('showVideoModal', true);
}
```

If you want to click to open the YouTube modal, you can set `showVideoModal` to `true` as an action

```
actions: {
    openYouTubeModal() {
        // Make sure the `showVideoModal` property is accessible to your action!
        this.set('showVideoModal', true);
    }
}
```

## Reuse

## Customizing The YouTube Modal

## Further Customizations

By the default the Youtube video modal is fullscreen, but this can be customized via css and by setting the `width` and `height` properties in the `modal-video` component.
