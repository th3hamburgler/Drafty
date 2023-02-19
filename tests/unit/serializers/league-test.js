import { module, test } from 'qunit';

import { setupTest } from 'drafty/tests/helpers';

module('Unit | Serializer | league', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('league');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('league', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
