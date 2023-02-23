import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default class LiveController extends Controller {
  // Services

  @service('fpl-api') fplApi;

  // Getters

  get loading() {
    return this.fplApi.bootstrap.isRunning;
  }
}
