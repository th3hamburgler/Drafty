import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LiveRoute extends Route {
  // Services

  @service('fpl-api') fplApi;

  // Methods

  model() {
    return this.fplApi.bootstrap();
    // return {
    //   league: this.loadLeagueData.perform(),
    //   matches: this.loadLiveMatches.perform(),
    //   bootstrap: this.loadBootstrap.perform(),
    // };
  }

  // Tasks
  // @task(function* (/*params*/) {
  //   return yield this.fplApi.getLeagueData();
  // })
  // loadLeagueData;

  // @task(function* (/*params*/) {
  //   return yield this.fplApi.getLiveMatches();
  // })
  // loadLiveMatches;

  // @task(function* (/*params*/) {
  //   return yield this.fplApi.getBootstrap();
  // })
  // loadBootstrap;
}
