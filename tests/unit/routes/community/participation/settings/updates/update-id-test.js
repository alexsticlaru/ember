import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/participation/settings/updates/:update-id', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/participation/settings/updates/:update-id');
    assert.ok(route);
  });
});
