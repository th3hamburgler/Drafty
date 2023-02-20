import Controller from '@ember/controller';
export default class LiveController extends Controller {
  // Getters

  get loading() {
    return this.model.loading;
  }
}
