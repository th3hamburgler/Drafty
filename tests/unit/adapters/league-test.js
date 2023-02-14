import { module, test } from 'qunit';

import { setupTest } from 'drafty/tests/helpers';

module('Unit | Adapter | league', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:league');
    assert.ok(adapter);
  });
});
