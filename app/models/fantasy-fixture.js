import Model, { attr, belongsTo } from '@ember-data/model';
import { cached } from '@glimmer/tracking';
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
    return this.home.get('picks').filter((p) => {
      return p.get('gameWeek.id') === gameWeekId;
    });
  }

  @cached
  get awayPicks() {
    const gameWeekId = this.get('gameWeek.id');
    return this.away.get('picks').filter((p) => {
      return p.get('gameWeek.id') === gameWeekId;
    });
  }

  get homeLiveScore() {
    let score = 0;
    // console.log(this.home.short_name);
    this.homePicks.forEach((p, i) => {
      if (i < 11) {
        // console.log(
        //   p.get('player.web_name'),
        //   p.multiplier,
        //   p.multiplier * p.get('appearance.total_points')
        // );
        score += p.multiplier * p.get('appearance.total_points');
      } else {
        // console.log(p.get('player.web_name'));
      }
    });
    return score;
  }

  get awayLiveScore() {
    let score = 0;
    // console.log(this.away.short_name);
    this.awayPicks.forEach((p, i) => {
      if (i < 11) {
        // console.log(
        //   p.get('player.web_name'),
        //   p.multiplier,
        //   p.multiplier * p.get('appearance.total_points')
        // );
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
}
