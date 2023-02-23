import Model, { attr, belongsTo } from '@ember-data/model';

export default class FantasyStandingModel extends Model {
  // Attributes

  @attr('number') last_rank;
  @attr('number') matches_drawn;
  @attr('number') matches_lost;
  @attr('number') matches_played;
  @attr('number') matches_won;
  @attr('number') points_against;
  @attr('number') points_for;
  @attr('number') rank;
  @attr('number') rank_sort;
  @attr('number') total;

  // Relationships

  @belongsTo('fantasy-team') team;

  // Aliases

  get played() {
    return this.matches_played;
  }

  get won() {
    return this.matches_won;
  }

  get drawn() {
    return this.matches_drawn;
  }

  get lost() {
    return this.matches_lost;
  }

  get pointsDifference() {
    return parseInt(this.points_for - this.points_against);
  }

  get pointsDifferencePerGame() {
    return Math.round(this.pointsDifference / this.matches_played);
  }

  get pointsAgainstPerGame() {
    return Math.round(this.points_against / this.matches_played);
  }
}
