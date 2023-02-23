import Controller from '@ember/controller';
import { pluralize } from 'ember-inflector';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class IndexController extends Controller {
  // Services

  @service('fpl-api') fplApi;

  // Tracking

  @tracked awardModal = null;
  @tracked showModal = false;

  // Action

  @action showAwardModal(value) {
    this.awardModal = value;
    this.showModal = true;
  }

  @action closeAwardModal() {
    this.showModal = false;
  }

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
      theWall = this.fplApi.theWall,
      loyal = this.fplApi.loyal;

    return [
      {
        title: 'Leader',
        icon: 'trophy',
        manager: leader.get('team.fullName'),
        value: pluralize(leader.get('total'), 'pt'),
        color: 'cyan',
        type: 'leader',
      },
      {
        title: 'Woodenspoon',
        icon: 'spoon',
        manager: looser.get('team.fullName'),
        value: pluralize(looser.get('total'), 'pt'),
        color: 'red',
        type: 'spoon',
      },
      {
        title: 'Lucky Man',
        icon: 'clover',
        manager: luckyMan.get('team.fullName'),
        value:
          pluralize(luckyMan.get('pointsAgainstPerGame'), 'pt') + ' against',
        color: 'lime',
        type: 'lucky-man',
      },
      {
        title: 'Flat-track Bully',
        icon: 'black-eye',
        manager: flatTrackBully.get('team.fullName'),
        value: `${pluralize(
          flatTrackBully.get('pointsDifferencePerGame'),
          'pt'
        )} victory`,
        color: 'yellow',
        type: 'flat-track-bully',
      },
      {
        title: 'Asleep at the wheel',
        icon: 'steering-wheel',
        manager: asleep.get('team.fullName'),
        value: pluralize(asleep.get('team.totalTransactions'), 'transfer'),
        color: 'yellow',
        type: 'asleep',
      },
      {
        title: 'The Tinker Man',
        icon: 'beaker',
        manager: tinkerMan.get('team.fullName'),
        value: pluralize(tinkerMan.get('team.totalTransactions'), 'transfer'),
        color: 'cyan',
        type: 'tinker-man',
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
        type: 'bench-warmer',
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
        type: 'changing-room',
      },
      {
        title: 'Loyal to a Fault?',
        icon: 'heart',
        manager: loyal.get('fullName'),
        value:
          pluralize(loyal.get('numberOfOriginalSquadPlayers'), 'player') +
          ' from original draft',
        color: 'lime',
        type: 'loyal',
      },
      {
        title: 'Can`t buy a goal',
        icon: 'currency-pound',
        manager: goal.get('fullName'),
        value: `${pluralize(goal.get('totalTeamGoals'), 'goal')} scored`,
        color: 'yellow',
        type: 'goal',
      },
      {
        title: 'Wasted Keeper',
        icon: 'gloves',
        manager: wastedKeeper.get('fullName'),
        value: `${pluralize(
          wastedKeeper.get('wastedKeeperPoints'),
          'pt'
        )} backup keeper`,
        color: 'cyan',
        type: 'wasted-keeper',
      },
      {
        title: 'The Wall',
        icon: 'wall',
        manager: theWall.get('fullName'),
        value: pluralize(theWall.get('totalCleanSheets'), 'clean sheet'),
        color: 'red',
        type: 'the-wall',
      },
    ];
  }

  get luckyManTotals() {
    return this.fplApi.luckyManTotals.map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.pointsAgainstPerGame,
      };
    });
  }

  get flatTrackBullyTotals() {
    return this.fplApi.flatTrackBullyTotals.map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.pointsDifferencePerGame,
      };
    });
  }

  get asleepTotals() {
    return this.fplApi.asleepTotals.map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.get('team.totalTransactions'),
      };
    });
  }

  get tinkerManTotals() {
    return this.fplApi.tinkerManTotals.map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.get('team.totalTransactions'),
      };
    });
  }

  get benchWarmerTotals() {
    return this.fplApi.benchWarmerTotals.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('totalLostBenchPoints'),
      };
    });
  }

  get changingRoomTotals() {
    return this.fplApi.changingRoomTotals.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('totalNegativePoints'),
      };
    });
  }

  get loyalTotals() {
    return this.fplApi.loyalTotals.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('numberOfOriginalSquadPlayers'),
      };
    });
  }

  get cantBuyAGoalTotal() {
    return this.fplApi.cantBuyAGoalTotal.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('totalTeamGoals'),
      };
    });
  }

  get wastedKeeperTotals() {
    return this.fplApi.wastedKeeperTotals.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('wastedKeeperPoints'),
      };
    });
  }

  get theWallTotals() {
    return this.fplApi.theWallTotals.map((team) => {
      return {
        team: team.get('entry_name'),
        manager: team.get('fullName'),
        total: team.get('totalCleanSheets'),
      };
    });
  }

  get leaderTotals() {
    return this.fplApi.standings.map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.get('total'),
      };
    });
  }

  get spoonTotals() {
    return this.fplApi.standings.reverse().map((standing) => {
      return {
        team: standing.get('team.entry_name'),
        manager: standing.get('team.fullName'),
        total: standing.get('total'),
      };
    });
  }
}
