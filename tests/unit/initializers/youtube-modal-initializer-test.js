import Ember from 'ember';
import YoutubeModalInitializerInitializer from 'dummy/initializers/youtube-modal-initializer';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | youtube modal initializer', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  YoutubeModalInitializerInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
