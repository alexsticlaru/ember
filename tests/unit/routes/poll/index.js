import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | poll/take poll', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:poll/take-poll');
    assert.ok(route);
  });
});
