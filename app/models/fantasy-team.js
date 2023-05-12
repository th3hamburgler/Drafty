import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { cached } from '@glimmer/tracking';
export default class FantasyTeamModel extends Model {
  // Attributes

  @attr('number') entry_id;
  @attr('string') entry_name;
  @attr('date') joined_time;
  @attr('string') player_first_name;
  @attr('string') player_last_name;
  @attr('string') short_name;
  @attr('number') waiver_pick;

  // Relationships

  @belongsTo('fantasy-standing') standing;
  @hasMany('fantasy-fixture', { inverse: 'home' }) homeFixtures;
  @hasMany('fantasy-fixture', { inverse: 'away' }) awayFixtures;
  @hasMany('fantasy-pick') picks;
  @hasMany('transactions') transactions;

  // Getters

  get fixtures() {
    return [...this.homeFixtures.toArray(), ...this.awayFixtures.toArray()];
  }

  get fullName() {
    return `${this.player_first_name} ${this.player_last_name}`;
  }

  get totalTransactions() {
    return this.transactions.filterBy('result', 'a').length;
  }

  get totalTrades() {
    return this.transactions.filterBy().filterBy('kind', 'di').length;
  }

  get lastFiveFixtures() {
    if (this.homeFixtures && this.awayFixtures) {
      let lastFive = this.fixtures.filterBy('finished', true);

      lastFive.sort((a, b) => a.get('gameWeek.id') - b.get('gameWeek.id'));

      return lastFive.slice(-5).map((fixture) => {
        let color, tip;
        if (fixture.get('home.id') === this.id) {
          // home team
          if (fixture.homeWin) {
            color = 'lime';
            tip = `Beat ${fixture.get('away.entry_name')}`;
          } else if (fixture.awayWin) {
            color = 'red';
            tip = `Lost to ${fixture.get('away.entry_name')}`;
          } else {
            color = 'cyan';
            tip = `Drew with ${fixture.get('away.entry_name')}`;
          }
        } else {
          // away team
          if (fixture.awayWin) {
            color = 'lime';
            tip = `Beat ${fixture.get('home.entry_name')}`;
          } else if (fixture.homeWin) {
            color = 'red';
            tip = `Lost to ${fixture.get('home.entry_name')}`;
          } else {
            color = 'cyan';
            tip = `Drew with ${fixture.get('home.entry_name')}`;
          }
        }

        return {
          color,
          fixture,
          tip,
        };
      });
    }
    return [];
  }

  @cached
  get totalLostBenchPoints() {
    let points = 0;

    this.picks.forEach((p) => {
      if (p.multiplier === 0) {
        const totalPoints = p.get('appearance.total_points');

        if (totalPoints) {
          points += totalPoints;
        }
      }
    });
    return points;
  }

  @cached
  get totalNegativePoints() {
    let points = 0;

    this.picks.forEach((p) => {
      if (p.multiplier !== 0) {
        const totalPoints = p.get('appearance.total_points');

        if (totalPoints < 0) {
          points += totalPoints;
        }
      }
    });
    return points;
  }

  @cached
  get totalTeamGoals() {
    let goals = 0;

    this.picks.forEach((p) => {
      if (p.multiplier !== 0) {
        const goalsScored = p.get('appearance.goals_scored');

        if (goalsScored) {
          goals += goalsScored;
        }
      }
    });
    return goals;
  }

  @cached get wastedKeeperPoints() {
    let points = 0;

    this.picks.forEach((p) => {
      const position = p.get('player.position.singular_name_short');
      if (p.multiplier === 0 && position === 'GKP') {
        const gkPoints = p.get('appearance.total_points');

        if (gkPoints) {
          points += gkPoints;
        }
      }
    });
    return points;
  }

  @cached
  get totalCleanSheets() {
    let cleanSheets = 0;

    this.picks.forEach((p) => {
      const position = p.get('player.position.singular_name_short');

      if (p.multiplier === 1 && (position === 'GKP' || position === 'DEF')) {
        const playerCleanSheets = p.get('appearance.clean_sheets');

        if (playerCleanSheets) {
          cleanSheets += playerCleanSheets;
        }
      }
    });
    return cleanSheets;
  }

  @cached
  get numberOfOriginalSquadPlayers() {
    // group picks by game week
    const picks = this.groupPicksByGameWeek(this.picks),
      gameWeeks = Object.keys(picks),
      firstGameWeek = gameWeeks.firstObject,
      lastGameWeek = gameWeeks.lastObject,
      originalPlayers = this.getMatchingPicks(
        picks[firstGameWeek],
        picks[lastGameWeek]
      );

    return originalPlayers.length;
  }

  // Methods
  groupPicksByGameWeek(picks) {
    const groupedPicks = {};

    // Iterate through each pick in the array
    picks.forEach((pick) => {
      const gameWeekId = pick.get('gameWeek.id');
      // If the gameWeek id doesn't exist in the groupedPicks object, create it
      if (!groupedPicks[gameWeekId]) {
        groupedPicks[gameWeekId] = [];
      }

      // Add the pick to the array for its corresponding gameWeek id
      groupedPicks[gameWeekId].push(pick);
    });

    return groupedPicks;
  }

  getMatchingPicks(picks1, picks2) {
    const matchingPicks = [];

    // Iterate through each pick in the first array
    picks1.forEach((pick1) => {
      // Check if there is a matching pick in the second array
      const matchingPick = picks2.find(
        (pick2) => pick1.get('player.id') === pick2.get('player.id')
      );
      if (matchingPick) {
        // If there is a matching pick, add it to the matchingPicks array
        matchingPicks.push(pick1);
      }
    });

    return matchingPicks;
  }
}
