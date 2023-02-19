import { module, test } from 'qunit';
import { setupTest } from 'drafty/tests/helpers';

module('Unit | Route | live', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:live');
    assert.ok(route);
  });
});
