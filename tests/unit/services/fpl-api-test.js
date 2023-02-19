import { module, test } from 'qunit';
import { setupTest } from 'drafty/tests/helpers';

module('Unit | Service | fpl-api', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:fpl-api');
    assert.ok(service);
  });
});
