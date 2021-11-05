import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | community/participation/settings', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:community/participation/settings');
    assert.ok(controller);
  });
});
