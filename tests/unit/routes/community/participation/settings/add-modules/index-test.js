import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/participation/settings/add-modules/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/participation/settings/add-modules/index');
    assert.ok(route);
  });
});
