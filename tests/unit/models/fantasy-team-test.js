import { module, test } from 'qunit';

import { setupTest } from 'drafty/tests/helpers';

module('Unit | Model | fantasy team', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('fantasy-team', {});
    assert.ok(model);
  });
});
