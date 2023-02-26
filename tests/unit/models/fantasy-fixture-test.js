import { module, test } from 'qunit';

import { setupTest } from 'drafty/tests/helpers';

module('Unit | Model | fantasy fixture', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('fantasy-fixture', {});
    assert.ok(model);
  });

  test('test full squad all starting', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      { points: 4, mins: 90, finished: true, position: 'GKP' },
      { points: 2, mins: 10, finished: true, position: 'DEF' },
      { points: 1, mins: 3, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 9);
  });

  test('test goal keeper subbed in', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      { points: 4, mins: 90, finished: true, position: 'GKP' },
      { points: 2, mins: 10, finished: true, position: 'DEF' },
      { points: 1, mins: 3, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
    ]);
    assert.equal(fixture.homeLiveScore, 13);
  });

  test('test goal keeper is not subbed in if neither play', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 2, mins: 10, finished: true, position: 'DEF' },
      { points: 1, mins: 3, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 9);
  });

  test('test goal keeper is not subbed in if both play', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 0, finished: false, position: 'GKP' },
      { points: 8, mins: 90, finished: true, position: 'DEF' },
      { points: 2, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 6, mins: 62, finished: true, position: 'DEF' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 8, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'FWD' },
      { points: 2, mins: 10, finished: true, position: 'FWD' },
      { points: 0, mins: 0, finished: false, position: 'GKP' },
      { points: 0, mins: 10, finished: true, position: 'DEF' },
      { points: 7, mins: 3, finished: true, position: 'MID' },
      { points: 0, mins: 65, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 35);
  });

  test('test goal keeper is not subbed in their match has not finished yet', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 0, finished: false, position: 'GKP' },
      { points: 8, mins: 90, finished: true, position: 'DEF' },
      { points: 2, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 6, mins: 62, finished: true, position: 'DEF' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 8, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'FWD' },
      { points: 2, mins: 10, finished: true, position: 'FWD' },
      { points: 0, mins: 0, finished: false, position: 'GKP' },
      { points: 0, mins: 10, finished: true, position: 'DEF' },
      { points: 7, mins: 3, finished: true, position: 'MID' },
      { points: 0, mins: 65, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 35);
  });

  test('test defender is subbed in if less than 3 are on pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      // Subs
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 1, mins: 3, finished: true, position: 'DEF' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
      { points: 2, mins: 10, finished: true, position: 'DEF' },
    ]);

    assert.equal(fixture.homeLiveScore, 9);
  });

  test('test two defenders are subbed in if less than 3 are on pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      // Subs
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 5, mins: 3, finished: true, position: 'DEF' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
      { points: 2, mins: 10, finished: true, position: 'DEF' },
    ]);

    assert.equal(fixture.homeLiveScore, 14);
  });

  test('test midfielder is subbed in if less than 2 are on pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 80, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      // Subs
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'MID' },
      { points: 2, mins: 10, finished: true, position: 'MID' },
    ]);

    assert.equal(fixture.homeLiveScore, 8);
  });

  test('test two midfielders are subbed in if less than 2 are on pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 90, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      // Subs
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'MID' },
      { points: 2, mins: 10, finished: true, position: 'MID' },
    ]);

    assert.equal(fixture.homeLiveScore, 10);
  });

  test('test one forward is subbed in if less than 1 is on pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 1, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 30, finished: true, position: 'MID' },
      { points: 0, mins: 4, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 0, finished: true, position: 'FWD' },
      // Subs
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 1, mins: 65, finished: true, position: 'FWD' },
      { points: 2, mins: 10, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 7);
  });

  test('test four players are subbed on if there are four valid spaced on the pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 0, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 1, mins: 20, finished: true, position: 'MID' },
      { points: 0, mins: 0, finished: true, position: 'MID' },
      { points: 1, mins: 90, finished: true, position: 'MID' },
      { points: 0, mins: 0, finished: true, position: 'FWD' },
      { points: 1, mins: 10, finished: true, position: 'FWD' },
      // Subs
      { points: 6, mins: 90, finished: true, position: 'GKP' },
      { points: 4, mins: 90, finished: true, position: 'MID' },
      { points: 5, mins: 65, finished: true, position: 'MID' },
      { points: 12, mins: 60, finished: true, position: 'FWD' },
    ]);

    assert.equal(fixture.homeLiveScore, 34);
  });

  test('test three mids are subbed on if there are three valid spaced on the pitch', function (assert) {
    let store = this.owner.lookup('service:store');

    const fixture = getFixture(store, [
      { points: 0, mins: 90, finished: true, position: 'GKP' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 1, mins: 90, finished: true, position: 'DEF' },
      { points: 0, mins: 0, finished: true, position: 'DEF' },
      { points: 1, mins: 62, finished: true, position: 'DEF' },
      { points: 1, mins: 60, finished: true, position: 'DEF' },
      { points: 1, mins: 20, finished: true, position: 'MID' },
      { points: 0, mins: 90, finished: true, position: 'MID' },
      { points: 2, mins: 90, finished: true, position: 'FWD' },
      { points: 0, mins: 0, finished: true, position: 'FWD' },
      { points: 0, mins: 0, finished: true, position: 'FWD' },
      // Subs
      { points: 6, mins: 90, finished: true, position: 'GKP' },
      { points: 4, mins: 90, finished: true, position: 'MID' },
      { points: 5, mins: 65, finished: true, position: 'MID' },
      { points: 12, mins: 60, finished: true, position: 'MID' },
    ]);

    assert.equal(fixture.homeLiveScore, 28);
  });
});

// Helper function
function getFixture(store, picks) {
  const gameWeek = genGameWeek(store, 1),
    positions = genPositions(store),
    home = genTeam(store, 1, 'Foo Athletic');

  home.picks = picks.map((p, i) => {
    // store, position, points, minutes, finished, gameWeek, playerPosition
    return genPick(
      store,
      i + 1,
      p.points,
      p.mins,
      p.finished,
      gameWeek,
      positions[p.position]
    );
  });

  return store.createRecord('fantasy-fixture', {
    home,
    gameWeek,
  });
}

function genPositions(store) {
  return {
    GKP: store.createRecord('position', {
      id: 1,
      plural_name: 'Goalkeepers',
      plural_name_short: 'GKP',
      singular_name: 'Goalkeeper',
      singular_name_short: 'GKP',
      squad_select: 2,
      squad_min_play: 1,
      squad_max_play: 1,
      ui_shirt_specific: true,
      sub_positions_locked: [12],
      element_count: 78,
    }),
    DEF: store.createRecord('position', {
      id: 2,
      plural_name: 'Defenders',
      plural_name_short: 'DEF',
      singular_name: 'Defender',
      singular_name_short: 'DEF',
      squad_select: 5,
      squad_min_play: 3,
      squad_max_play: 5,
      ui_shirt_specific: false,
      sub_positions_locked: [],
      element_count: 254,
    }),
    MID: store.createRecord('position', {
      id: 3,
      plural_name: 'Midfielders',
      plural_name_short: 'MID',
      singular_name: 'Midfielder',
      singular_name_short: 'MID',
      squad_select: 5,
      squad_min_play: 2,
      squad_max_play: 5,
      ui_shirt_specific: false,
      sub_positions_locked: [],
      element_count: 322,
    }),
    FWD: store.createRecord('position', {
      id: 4,
      plural_name: 'Forwards',
      plural_name_short: 'FWD',
      singular_name: 'Forward',
      singular_name_short: 'FWD',
      squad_select: 3,
      squad_min_play: 1,
      squad_max_play: 3,
      ui_shirt_specific: false,
      sub_positions_locked: [],
      element_count: 92,
    }),
  };
}

function genTeam(store, id, name) {
  return store.createRecord('fantasy-team', {
    entry_id: id,
    entry_name: name,
    player_first_name: 'Jonny',
    player_last_name: 'Appleseed',
    short_name: 'JA',
  });
}

function genPick(
  store,
  position,
  points,
  minutes,
  finished,
  gameWeek,
  playerPosition
) {
  const appearance = store.createRecord('appearance', {
      total_points: points,
      minutes,
      finished,
    }),
    player = store.createRecord('pro-player', {
      position: playerPosition,
      appearances: [appearance],
    });

  return store.createRecord('fantasy-pick', {
    multiplier: position < 12 ? 1 : 0,
    position,
    started_on_bench: position > 11,
    gameWeek,
    player,
    appearance: appearance,
  });
}

function genGameWeek(store, id) {
  return store.createRecord('game-week', {
    id,
    name: `Game Week ${id}`,
  });
}
