import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LiveController extends Controller {
  // Services

  @service('fpl-api') fplApi;

  // Tracked

  @tracked showGameWeeks = false;
  @tracked showPositions = false;
  @tracked showProTeams = false;
  @tracked showProPlayers = false;
  @tracked showProFixtures = false;
  @tracked showFantasyFixtures = false;
  @tracked showFantasyLeague = true;

  // Getters

  get loading() {
    return this.model.loading;
  }

  // Actions
  @action toggle(prop) {
    this[prop] = !this[prop];
  }

  // get maxGameWeek() {
  //   return 38;
  // }

  // get minGameWeek() {
  //   return 1;
  // }

  // get matches() {
  //   if (this.loading) {
  //     return;
  //   }
  //   const matches = this.model.league.value.matches,
  //     event = this.currentGameWeek;

  //   return matches.filter((m) => m.event === event);
  // }

  // get standings() {
  //   if (this.loading) {
  //     return;
  //   }
  //   return this.model.league.value.standings;
  // }

  // get plGames() {
  //   if (this.loading) {
  //     return;
  //   }
  //   console.log(this.model.matches.value);
  //   return this.model.matches.value;
  // }
}
