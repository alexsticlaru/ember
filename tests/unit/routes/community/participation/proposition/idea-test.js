import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/participation/proposition/idea', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/participation/proposition/idea');
    assert.ok(route);
  });
});
