import Controller from '@ember/controller';
import { pluralize } from 'ember-inflector';

export default class IndexController extends Controller {
  // Getters

  get awards() {
    if (this.model.loading) {
      return [];
    }

    return [
      {
        title: 'Leader',
        icon: 'trophy',
        manager: this.model.leader.get('team.fullName'),
        value: pluralize(this.model.leader.get('total'), 'pt'),
        color: 'cyan',
      },
      {
        title: 'Woodenspoon',
        icon: 'spoon',
        manager: this.model.looser.get('team.fullName'),
        value: pluralize(this.model.looser.get('total'), 'pt'),
        color: 'red',
      },
      {
        title: 'Del Boy',
        icon: 'currency-pound',
        manager: 'Tom O`Brien',
        value: '15 trades',
        color: 'lime',
      },
      {
        title: 'Flat-track Bully',
        icon: 'black-eye',
        manager: this.model.flatTrackBully.get('team.fullName'),
        value: `${pluralize(
          this.model.flatTrackBully.pointsPerScore,
          'point'
        )} per score`,
        color: 'yellow',
      },
      {
        title: 'Asleep at the wheel',
        icon: 'steering-wheel',
        manager: this.model.asleep.get('team.fullName'),
        value: pluralize(
          this.model.asleep.get('team.totalTransactions'),
          'transfer'
        ),
        color: 'yellow',
      },
      {
        title: 'The Tinker Man',
        icon: 'beaker',
        manager: this.model.tinkerMan.get('team.fullName'),
        value: pluralize(
          this.model.tinkerMan.get('team.totalTransactions'),
          'transfer'
        ),
        color: 'cyan',
      },
      {
        title: 'Bench Warmer',
        icon: 'bench',
        manager: 'Mike Ewen',
        value: '78pts left on the bench',
        color: 'red',
      },
      {
        title: 'Lost the Changing Room',
        icon: 'boxing',
        manager: 'Steve Borrington',
        value: '32 negative points',
        color: 'lime',
      },
    ];
  }
}
