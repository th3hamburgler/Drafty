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
      luckyMan = this.fplApi.luckyMan,
      asleep = this.fplApi.asleep,
      tinkerMan = this.fplApi.tinkerMan,
      benchWarmer = this.fplApi.benchWarmer,
      changingRoom = this.fplApi.changingRoom;

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
      {
        title: 'Lucky Man',
        icon: 'clover',
        manager: luckyMan.get('team.fullName'),
        value: pluralize(luckyMan.get('points_against'), 'pt') + ' against',
        color: 'lime',
      },
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
      {
        // todo
        title: 'Lost the Changing Room',
        icon: 'boxing',
        manager: changingRoom.get('fullName'),
        value: pluralize(
          changingRoom.get('totalNegativePoints'),
          'negative player pt'
        ),
        color: 'lime',
      },
      // best defence (most points)
      // worst forward line
      // waste of a good keeper
      // saved by the subs
      // good draft - most amount of original squad
    ];
  }
}
