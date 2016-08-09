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

```js
// controller/application.js
showVideoModal: false
```

Then pass the property down to your `{{modal-video}}` component. I recommend you place your YouTube video modal component at the application root aka `application.hbs`.

```hbs
// application.hbs
{{modal-video
    showVideoModal = showVideoModal
}}
```

Next you define a `videoId` property whose value is the id of your YouTube video.

```js
// application.js
videoId: <Your YouTube Video ID>
```

Then likewise pass the property down to your `{{modal-video}}` component.

```hbs
// application.hbs
{{modal-video
    showVideoModal = showVideoModal  
    
    videoId=videoId
}}
```

That's it for the initial setup.

## How To Open And Play the YouTube-Modal video

To open the modal and play the video after the page loads, you have to set `showVideoModal` to `true` in the `init()` function.

```js
// controllers/application.js
init() {
    this._super(...arguments);

    this.set('showVideoModal', true);
}
```

If you want to click an element to open the YouTube modal, you can do this by setting `showVideoModal` to `true` in an action:

```js
actions: {
    openYouTubeModal() {
        // Make sure the `showVideoModal` property is accessible to your action!
        this.set('showVideoModal', true);
    }
}
```

## Reuse (multiple YouTube modals)

Let's say you have a videos route/page and on that page you want to display a gallery of thumbnails that open up YouTube modals. Well you're in luck because this addon and its modal component is reusable. 

In your `videos.js` route file, define your array of videos and pass it down as a model.

```js
...

// routes/videos.js
let listOfVideos = [
    {
        "name": "gleason",
        "id": "WgkQU32XSFQ"
    },
    {
        "name": "mothersday",
        "id": "2BPr217zLps"
    },
    {
        "name": "bleedforthis",
        "id": "LiDO_sP00uk"
    }
];

export default Ember.Route.extend({

    model() {
        return listOfVideos;
    }

});

```

Then in your `videos.js` controller file you have to inject into it the `application.js` controller and read its properties.

```js
// controllers/videos.js
import Ember from 'ember';

export default Ember.Controller.extend({

    applicationController: Ember.inject.controller('application'),
    daApplicationController: Ember.computed.reads('applicationController'),

});
```

Create a videos gallery component and pass to down to it the `listOfVideos` model and the `openModal` action read from the applications controller.

```hbs
// routes/videos.hbs

{{videos-gallery
    videos=model
    openModal=(action "openModal")
}}
```
Define another `openModal` action in your `videos-gallery` component js file that will call the passed down `openModal` action.

```js
// components/videos-gallery.js
    actions: {
        openModal(id) {
            this.get('openModal')(id);
        }
    }
```
Add the `openModal` action to whatever DOM element you want to trigger an opened modal. Pass to it the `id` of the video.

```hbs
// templates/componentsvideos-gallery.hbs

{{#each videos as |video|}}
    <button {{action "openModal" video.id}}>Open {{video.name}}</button>
{{/each}}

```

That's it!

## Customize The YouTube Modal Controls

If you, your designer, or your client don't like YouTube's default controls for whatever reason, then you're in luck because this addon gives you fully customizable controls.

FIrst in your `modal-video` component, set `customControls` to be `true`

```hbs
// application.hbs
{{modal-video
    customControls = true
}}
```
### Custom HTML

```hbs
// application.hbs
{{modal-video
    customControls = true

    // The close modal icon
    closeIcon = '<Your Custom Text, HTML, or SVG>'
    // The element between the elapsed time and the total time
    durationDivider = '<Your Custom Textm, HTML, or SVG>'
    // The play video icon
    playIcon = '<Your Custom Text, HTML, or SVG>'
    // The pause video icon
    pauseIcon = '<Your Custom Text, HTML, or SVG>'
}}
```

## Further Customizations

By default the Youtube video modal is fullscreen, but this can be customized via CSS and by setting the `width` and `height` properties in the `modal-video` component.
