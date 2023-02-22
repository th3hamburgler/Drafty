import Controller from '@ember/controller';
import { pluralize } from 'ember-inflector';
import { inject as service } from '@ember/service';
export default class IndexController extends Controller {
  // Services

  @service('fpl-api') fplApi;

  // Getters

  get loading() {
    return this.fplApi.bootstrap.isRunning;
  }

  get awards() {
    if (this.loading) {
      return [];
    }

    const leader = this.fplApi.leader,
      looser = this.fplApi.looser,
      flatTrackBully = this.fplApi.flatTrackBully,
      asleep = this.fplApi.asleep,
      tinkerMan = this.fplApi.tinkerMan,
      benchWarmer = this.fplApi.benchWarmer;

    return [
      {
        title: 'Leader',
        icon: 'trophy',
        manager: leader.get('team.fullName'),
        value: pluralize(leader.get('total'), 'pt'),
        color: 'cyan',
      },
      {
        title: 'Woodenspoon',
        icon: 'spoon',
        manager: looser.get('team.fullName'),
        value: pluralize(looser.get('total'), 'pt'),
        color: 'red',
      },
      // {
      //   // TODO - One man team
      //   title: 'Del Boy',
      //   icon: 'currency-pound',
      //   manager: 'Tom O`Brien',
      //   value: '15 trades',
      //   color: 'lime',
      // },
      {
        title: 'Flat-track Bully',
        icon: 'black-eye',
        manager: flatTrackBully.get('team.fullName'),
        value: `${pluralize(
          flatTrackBully.get('pointsDifference'),
          'pt'
        )} difference`,
        color: 'yellow',
      },
      {
        title: 'Asleep at the wheel',
        icon: 'steering-wheel',
        manager: asleep.get('team.fullName'),
        value: pluralize(asleep.get('team.totalTransactions'), 'transfer'),
        color: 'yellow',
      },
      {
        title: 'The Tinker Man',
        icon: 'beaker',
        manager: tinkerMan.get('team.fullName'),
        value: pluralize(tinkerMan.get('team.totalTransactions'), 'transfer'),
        color: 'cyan',
      },
      {
        // todo
        title: 'Bench Warmer',
        icon: 'bench',
        manager: benchWarmer.get('fullName'),
        value: `${pluralize(
          benchWarmer.get('totalLostBenchPoints'),
          'pt'
        )} left on the bench`,
        color: 'red',
      },
      // {
      //   // todo
      //   title: 'Lost the Changing Room',
      //   icon: 'boxing',
      //   manager: 'Steve Borrington',
      //   value: '32 negative player pts',
      //   color: 'lime',
      // },
      // best defence (most points)
      // worst forward line
      // waste of a good keeper
      // saved by the subs
      // good draft - most amount of original squad
    ];
  }
}
