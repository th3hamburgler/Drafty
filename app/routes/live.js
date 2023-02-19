import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LiveRoute extends Route {
  // Services

  @service('fpl-api') fplApi;

  // Methods

  model() {
    return this.fplApi.bootstrap();
  }
}
