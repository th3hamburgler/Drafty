import groupBy from 'drafty/utils/group-by';
import { module, test } from 'qunit';

module('Unit | Utility | groupBy', function () {
  test('it groups objects by property', function (assert) {
    const list = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 25 },
      { name: 'Dave', age: 30 },
    ];
    const result = groupBy(list, 'age');

    assert.equal(result.size, 2, 'Result should have 2 groups');
    assert.deepEqual(
      result.get(25),
      [list[0], list[2]],
      'Group 1 should have Alice and Charlie'
    );
    assert.deepEqual(
      result.get(30),
      [list[1], list[3]],
      'Group 2 should have Bob and Dave'
    );
  });
});
