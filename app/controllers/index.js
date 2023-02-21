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

    // const flatTrackBully = this.fplApi.flatTrackBully,
    //   benchWarmer = this.fplApi.benchWarmer;

    return [
      {
        title: 'Leader',
        icon: 'trophy',
        manager: this.fplApi.leader.get('team.fullName'),
        value: pluralize(this.fplApi.leader.get('total'), 'pt'),
        color: 'cyan',
      },
      {
        title: 'Woodenspoon',
        icon: 'spoon',
        manager: this.fplApi.looser.get('team.fullName'),
        value: pluralize(this.fplApi.looser.get('total'), 'pt'),
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
      // {
      //   title: 'Flat-track Bully',
      //   icon: 'black-eye',
      //   manager: flatTrackBully.get('team.fullName'),
      //   value: `${pluralize(
      //     flatTrackBully.get('pointsDifference'),
      //     'pt'
      //   )} difference`,
      //   color: 'yellow',
      // },
      // {
      //   title: 'Asleep at the wheel',
      //   icon: 'steering-wheel',
      //   manager: this.fplApi.asleep.get('team.fullName'),
      //   value: pluralize(
      //     this.fplApi.asleep.get('team.totalTransactions'),
      //     'transfer'
      //   ),
      //   color: 'yellow',
      // },
      // {
      //   title: 'The Tinker Man',
      //   icon: 'beaker',
      //   manager: this.fplApi.tinkerMan.get('team.fullName'),
      //   value: pluralize(
      //     this.fplApi.tinkerMan.get('team.totalTransactions'),
      //     'transfer'
      //   ),
      //   color: 'cyan',
      // },
      // {
      //   // todo
      //   title: 'Bench Warmer',
      //   icon: 'bench',
      //   manager: benchWarmer.get('fullName'),
      //   value: `${pluralize(
      //     benchWarmer.get('totalLostBenchPoints'),
      //     'pt'
      //   )} left on the bench`,
      //   color: 'red',
      // },
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
