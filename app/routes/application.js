import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  // Services

  @service('fpl-api') fplApi;

  // Methods

  setupController(/*controller, model*/) {
    super.setupController(...arguments);
    // console.log(this.fplApi);
    this.fplApi.bootstrap.perform(/*model.id*/);
  }

  resetController() {
    super.resetController(...arguments);
    this.fplApi.bootstrap.cancelAll();
  }
}
