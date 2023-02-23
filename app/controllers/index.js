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
      changingRoom = this.fplApi.changingRoom,
      goal = this.fplApi.cantBuyAGoal,
      wastedKeeper = this.fplApi.wastedKeeper,
      cleanSheets = this.fplApi.cleanSheets,
      loyal = this.fplApi.loyal;

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
        title: 'Lost the Changing Room',
        icon: 'boxing',
        manager: changingRoom.get('fullName'),
        value: pluralize(
          changingRoom.get('totalNegativePoints'),
          'negative player pt'
        ),
        color: 'lime',
      },
      {
        title: 'Loyal to a Fault?',
        icon: 'heart',
        manager: loyal.get('fullName'),
        value:
          pluralize(loyal.get('numberOfOriginalSquadPlayers'), 'player') +
          ' from original draft',
        color: 'lime',
      },
      {
        title: 'Can`t buy a goal',
        icon: '',
        manager: goal.get('fullName'),
        value: pluralize(goal.get('totalTeamGoals'), 'goal'),
        color: 'yellow',
      },
      {
        title: 'Wasted Keeper',
        icon: '',
        manager: wastedKeeper.get('fullName'),
        value: pluralize(wastedKeeper.get('wastedKeeperPoints'), 'pt'),
        color: 'cyan',
      },
      {
        title: 'Dry Sheets',
        icon: '',
        manager: cleanSheets.get('fullName'),
        value: pluralize(cleanSheets.get('totalCleanSheets'), 'clean sheet'),
        color: 'red',
      },
    ];
  }
}
