import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | community/settings/add-project', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:community/settings/add-project');
    assert.ok(route);
  });
});
