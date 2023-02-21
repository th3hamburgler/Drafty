import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task, all, waitForProperty, timeout } from 'ember-concurrency';

export default class IndexRoute extends Route {
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

  // model() {
  //   return this.fplApi.bootstrap.perform();
  // }
}
