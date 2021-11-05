import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/participation/settings/add-modules/questionnaire', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/participation/settings/add-modules/questionnaire');
    assert.ok(route);
  });
});
