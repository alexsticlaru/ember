import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/participation/settings/administrator', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/participation/settings/administrator');
    assert.ok(route);
  });
});
