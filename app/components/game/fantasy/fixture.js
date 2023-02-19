import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GameFantasyFixtureComponent extends Component {
  // Tracked

  @tracked showDetails = false;

  // Actions

  @action toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
