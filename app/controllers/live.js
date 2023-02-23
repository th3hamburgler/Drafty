import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LiveController extends Controller {
  // Services

  @service('fpl-api') fplApi;

  // Properties

  queryParams = ['week'];

  // Tracked

  @tracked week = null;

  // Getters

  get loading() {
    return this.fplApi.bootstrap.isRunning;
  }

  get gameWeek() {
    const weeks = this.fplApi.gameWeeks;

    if (this.week) {
      return weeks[this.week - 1];
    } else {
      return this.fplApi.currentGameWeek;
    }
  }

  get gameWeekFantasyFixtures() {
    return this.fplApi.gameWeekFantasyFixtures(this.gameWeek);
  }

  get gameWeekProFixtures() {
    return this.gameWeek.proFixtures;
  }

  get disablePrev() {
    return parseInt(this.week) === 1;
  }
  get disableNext() {
    const maxWeeks = this.fplApi.gameWeeks.length;
    return parseInt(this.week) >= maxWeeks;
  }

  get prevGameWeek() {
    if (this.week == null) {
      return parseInt(this.gameWeek.id) - 1;
    } else if (parseInt(this.week) === 1) {
      return 1;
    } else {
      return parseInt(this.week) - 1;
    }
  }

  get nextGameWeek() {
    const maxWeeks = this.fplApi.gameWeeks.length;

    if (this.week == null) {
      return parseInt(this.gameWeek.id) + 1;
    } else if (parseInt(this.week) >= maxWeeks) {
      return maxWeeks;
    } else {
      return parseInt(this.week) + 1;
    }
  }

  // Actions
}
