import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | themesv2', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:themesv2');
    assert.ok(route);
  });
});
