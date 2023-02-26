import groupBy from 'drafty/utils/group-by';
import { module, test } from 'qunit';

const students = [
  { name: 'Alice', grade: 'A' },
  { name: 'Bob', grade: 'B' },
  { name: 'Charlie', grade: 'A' },
  { name: 'Dave', grade: 'C' },
  { name: 'Eve', grade: 'B' },
  { name: 'Frank', grade: 'C' },
];

module('Unit | Utility | group-by', function () {
  test('groups items in an array by a specified key', function (assert) {
    let result = groupBy(students, 'grade');

    assert.equal(result.size, 3);

    assert.deepEqual(result.get('A'), [students[0], students[2]]);

    assert.deepEqual(result.get('B'), [students[1], students[4]]);

    assert.deepEqual(result.get('C'), [students[3], students[5]]);
  });
});
