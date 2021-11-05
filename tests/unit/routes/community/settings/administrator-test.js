import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/settings/administrator', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/settings/administrator');
    assert.ok(route);
  });
});
