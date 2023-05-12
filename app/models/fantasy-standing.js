import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class FantasyStandingModel extends Model {
  // Services

  @service('fpl-api') fplApi;

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

  get liveTotal() {
    const gameWeek = this.fplApi.currentGameWeek;

    if (gameWeek.finished) {
      return this.total;
    } else {
      return this.total + this.lastGameWeekPoints;
    }
  }

  get lastGameWeekPoints() {
    const team = this.get('team'),
      currentFixture = team.get('fixtures').find((fixture) => {
        return fixture.get('gameWeek.is_current');
      });

    if (currentFixture.get('home.id') === team.get('id')) {
      return currentFixture.homePoints;
    }
    if (currentFixture.get('away.id') === team.get('id')) {
      return currentFixture.awayPoints;
    }
  }
}
