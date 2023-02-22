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

  get fullName() {
    return `${this.player_first_name} ${this.player_last_name}`;
  }

  get totalTransactions() {
    return this.transactions.filterBy('result', 'a').length;
  }

  get totalTrades() {
    return this.transactions.filterBy().filterBy('kind', 'di').length;
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
}
