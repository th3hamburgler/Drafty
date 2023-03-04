import Model, { attr, belongsTo } from '@ember-data/model';
import { cached } from '@glimmer/tracking';
import groupBy from 'drafty/utils/group-by';

const GROUP_BY_POSITIONS = new Map();
GROUP_BY_POSITIONS.set('GKP', []);
GROUP_BY_POSITIONS.set('DEF', []);
GROUP_BY_POSITIONS.set('MID', []);
GROUP_BY_POSITIONS.set('FWD', []);
export default class FantasyFixtureModel extends Model {
  // Attributes

  @attr('boolean') finished;
  @attr('number') league_entry_1_points;
  @attr('number') league_entry_2_points;
  @attr('boolean') started;
  @attr('string') winning_league_entry;
  @attr('string') winning_method;

  // Relationships
  @belongsTo('fantasy-team') home;
  @belongsTo('fantasy-team') away;
  @belongsTo('game-week') gameWeek;

  // Aliases

  get homeScore() {
    return this.league_entry_1_points;
  }

  get awayScore() {
    return this.league_entry_2_points;
  }

  get homeWin() {
    return this.league_entry_1_points > this.league_entry_2_points;
  }

  get awayWin() {
    return this.league_entry_2_points > this.league_entry_1_points;
  }

  get draw() {
    return this.league_entry_1_points === this.league_entry_2_points;
  }

  get statusColor() {
    // pending
    if (!this.started) {
      return 'bg-yellow';
    } else if (!this.finished) {
      // in progress
      return 'bg-lime';
    } else {
      // complete
      return 'bg-cyan';
    }
  }

  @cached
  get homePicks() {
    const gameWeekId = this.get('gameWeek.id');
    return this.home.get('picks')?.filter((p) => {
      return p.get('gameWeek.id') === gameWeekId;
    });
  }

  @cached
  get liveHomePicks() {
    try {
      const gameWeekId = this.get('gameWeek.id');

      // Assumptions: GKPs will always be at index 0 and 11 in the picks array
      let picks = this.home.get('picks')?.filter((p) => {
        return p.get('gameWeek.id') === gameWeekId;
      });

      picks = this.livePicks(picks);

      // if (this.get('home.entry_name') === 'Bang Average V') {
      //   console.table(
      //     picks.map((p) => {
      //       return {
      //         player: p.get('player.web_name'),
      //         position: p.get('player.position.singular_name_short'),
      //         points: p.get('appearance.total_points'),
      //         subbed_off: p.subbed_off,
      //         subbed_on: p.subbed_on,
      //       };
      //     })
      //   );
      // }
      return picks;
    } catch (e) {
      console.log(e);
    }
  }

  @cached
  get awayPicks() {
    const gameWeekId = this.get('gameWeek.id');
    return this.away.get('picks')?.filter((p) => {
      return p.get('gameWeek.id') === gameWeekId;
    });
  }

  @cached
  get liveAwayPicks() {
    try {
      const gameWeekId = this.get('gameWeek.id');

      // Assumptions: GKPs will always be at index 0 and 11 in the picks array
      let picks = this.away.get('picks')?.filter((p) => {
        return p.get('gameWeek.id') === gameWeekId;
      });

      picks = this.livePicks(picks);

      return picks;
    } catch (e) {
      console.log(e);
    }
  }

  get homeLiveScore() {
    let score = 0;

    this.liveHomePicks.forEach((p, i) => {
      if (i < 11) {
        score += p.multiplier * p.get('appearance.total_points');
      } else {
        // console.log(p.get('player.web_name'));
      }
    });
    return score;
  }

  get awayLiveScore() {
    let score = 0;

    this.liveAwayPicks?.forEach((p, i) => {
      if (i < 11) {
        score += p.multiplier * p.get('appearance.total_points');
      } else {
        // console.log(p.get('player.web_name'));
      }
    });
    return score;
  }

  get score() {
    if (this.started) {
      return `${this.league_entry_1_points} - ${this.league_entry_2_points}`;
    } else {
      return `- v -`;
    }
  }

  // Methods

  livePicks(picks) {
    // get first 11
    const firstEleven = this.firstEleven(picks);
    // get bench
    const bench = this.bench(picks);

    // return players who can be subbed off
    let canBeSubbedOut = this.canBeSubbedOut(firstEleven);
    // Group by position
    const groupedCanBeSubbedOut = this.groupedCanBeSubbedOut(canBeSubbedOut);

    // return bench players who started
    const canBeSubbedIn = this.canBeSubbedIn(bench);
    // group subs by position
    const groupedCanBeSubbedIn = this.groupedCanBeSubbedIn(canBeSubbedIn);

    // get remaining players on the pitch
    const onThePitch = this.onThePitch(firstEleven);

    // group starters by position
    const groupedOnThePitch = this.groupedOnThePitch(onThePitch);

    // Now we check each position to see what positions we need to fill first

    // does the team have 1 keeper
    if (groupedOnThePitch.get('GKP').length < 1) {
      // did the sub keeper start
      if (groupedCanBeSubbedIn.get('GKP').length) {
        picks = this.subPlayer(
          picks,
          groupedCanBeSubbedOut.get('GKP').firstObject.position,
          groupedCanBeSubbedIn.get('GKP').firstObject.position,
          'sub the gkp in'
        );
      }
      // if no pop one off the bench and on to gk group
    }

    // now clear the canBeSubbedOut of any goalkeeper as they cant be
    // subbed in at a different position
    canBeSubbedOut.removeObjects(
      canBeSubbedOut.filterBy('player.position.singular_name_short', 'GKP')
    );

    // remove gkp from bench array so he isnt
    // subbed out for an outfield player
    canBeSubbedIn.removeObjects(
      canBeSubbedIn.filterBy('player.position.singular_name_short', 'GKP')
    );

    //
    // DEF
    //

    // does the team have enough defenders
    if (groupedOnThePitch.get('DEF').length < 3) {
      // can any defenders on the bench come on?
      if (groupedCanBeSubbedIn.get('DEF').length) {
        const pout = groupedCanBeSubbedOut.get('DEF').firstObject,
          pin = groupedCanBeSubbedIn.get('DEF').firstObject;

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub a def in to ensure 3 players'
        );

        // now clear the canBeSubbedOut of player subbed out
        canBeSubbedOut.removeObject(pout);

        // now clear the canBeSubbedOut of player subbed in
        canBeSubbedIn.removeObject(pin);
      }

      // its possible that you have 2 defenders on the bench and 2 who have not started on the pitch
      // we'll check again for the second sub
      if (
        groupedCanBeSubbedOut.get('DEF').length > 1 &&
        groupedCanBeSubbedIn.get('DEF').length > 1
      ) {
        const pout = groupedCanBeSubbedOut.get('DEF')[1],
          pin = groupedCanBeSubbedIn.get('DEF')[1];

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub another def in to ensure 3 players'
        );

        // now clear the canBeSubbedOut of player subbed out
        canBeSubbedOut.removeObject(pout);

        // now clear the canBeSubbedOut of player subbed in
        canBeSubbedIn.removeObject(pin);
      }
    }

    //
    // MID
    //

    // does the team have enough midfielders
    if (groupedOnThePitch.get('MID').length < 2) {
      // can any midfielders on the bench come on?
      if (groupedCanBeSubbedIn.get('MID').length) {
        const pout = groupedCanBeSubbedOut.get('MID').firstObject,
          pin = groupedCanBeSubbedIn.get('MID').firstObject;

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub a mid in to ensure 2 players'
        );

        // now clear the canBeSubbedOut of player subbed out
        canBeSubbedOut.removeObject(pout);

        // now clear the canBeSubbedOut of player subbed in
        canBeSubbedIn.removeObject(pin);
      }
      // its possible that you have 2 midfielders on the bench and 2 who have not started on the pitch
      // we'll check again for the second sub
      if (
        groupedCanBeSubbedOut.get('MID').length > 1 &&
        groupedCanBeSubbedIn.get('MID').length > 1
      ) {
        const pout = groupedCanBeSubbedOut.get('MID')[1],
          pin = groupedCanBeSubbedIn.get('MID')[1];

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub another mid in to ensure 2 players'
        );

        // now clear the canBeSubbedOut of player subbed out
        canBeSubbedOut.removeObject(pout);

        // now clear the canBeSubbedOut of player subbed in
        canBeSubbedIn.removeObject(pin);
      }
    }

    //
    // FWD
    //

    // does the team have enough forwards
    if (groupedOnThePitch.get('FWD').length < 1) {
      // can any forwards on the bench come on?
      if (groupedCanBeSubbedIn.get('FWD').length) {
        const pout = groupedCanBeSubbedOut.get('FWD').firstObject,
          pin = groupedCanBeSubbedIn.get('FWD').firstObject;

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub a fwd in to ensure 1 player'
        );

        // now clear the canBeSubbedOut of player subbed out
        canBeSubbedOut.removeObject(pout);

        // now clear the canBeSubbedOut of player subbed in
        canBeSubbedIn.removeObject(pin);
      }
    }

    // loop over can be subbed in and replace from the bench
    canBeSubbedOut.forEach((pout) => {
      if (canBeSubbedIn.length) {
        const pin = canBeSubbedIn.shift();

        picks = this.subPlayer(
          picks,
          pout.position,
          pin.position,
          'sub a player in due to their bench rank'
        );
      }
    });

    return picks;
  }

  subPlayer(picks, outPosition, inPosition, desc = '') {
    const pout = picks[outPosition - 1],
      pin = picks[inPosition - 1];
    // prepare the players on the side line for substitution
    picks[outPosition - 1] = pin;
    picks[inPosition - 1] = pout;

    // update multiplier which is multiplied by total_points for the players score
    pin.multiplier = 1;
    pin.subbed_on = true;
    pin.subbed_off = false;

    pout.multiplier = 0;
    pout.subbed_on = false;
    pout.subbed_off = true;

    console.log(desc, {
      out: pout.get('appearance.total_points'),
      in: pin.get('appearance.total_points'),
    });
    return picks;
  }

  firstEleven(picks) {
    return picks.slice(0, 11);
  }

  bench(picks) {
    return picks.slice(-4);
  }

  canBeSubbedOut(firstEleven) {
    // if (this.get('home.entry_name') === 'Bang Average V') {
    //   console.table(
    //     firstEleven.map((p) => {
    //       return {
    //         player: p.get('player.web_name'),
    //         canBeSubbedOut: p.get('appearance.canBeSubbedOut'),
    //       };
    //     })
    //   );
    // }

    return firstEleven.filterBy('appearance.canBeSubbedOut', true);
  }

  groupedCanBeSubbedOut(canBeSubbedOut) {
    return new Map([
      ...GROUP_BY_POSITIONS,
      ...groupBy(canBeSubbedOut, 'player.position.singular_name_short'),
    ]);
  }

  canBeSubbedIn(bench) {
    return bench.filterBy('appearance.canBeSubbedIn', true);
  }

  groupedCanBeSubbedIn(canBeSubbedIn) {
    return new Map([
      ...GROUP_BY_POSITIONS,
      ...groupBy(canBeSubbedIn, 'player.position.singular_name_short'),
    ]);
  }

  onThePitch(firstEleven) {
    return firstEleven.filterBy('appearance.canBeSubbedOut', false);
  }

  groupedOnThePitch(onThePitch) {
    return new Map([
      ...GROUP_BY_POSITIONS,
      ...groupBy(onThePitch, 'player.position.singular_name_short'),
    ]);
  }
}
