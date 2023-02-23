import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GameFantasyFixtureComponent extends Component {
  // Services

  @service('fpl-api') fplApi;

  // Getters

  get fixtures() {
    const nextFixture = this.args.match;

    return this.fplApi
      .getSimilarFixtures(nextFixture)
      .filterBy('finished', true);
  }
}
