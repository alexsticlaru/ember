import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | act/contribution', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:act/contribution');
    assert.ok(route);
  });
});
