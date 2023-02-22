import Model, { attr, belongsTo } from '@ember-data/model';
import { singularize, pluralize } from 'ember-inflector';

const APPEARANCE_STATUS = {
  PENDING: 'pending',
  PLAYED: 'played',
  BENCHED: 'benched',
  PLAYING: 'playing',
};
export default class AppearanceModel extends Model {
  // Attributes

  @attr('number') assists;
  @attr('number') bonus;
  @attr('number') bps;
  @attr('number') clean_sheets;
  @attr('number') creativity;
  @attr('array') explain;
  @attr('number') goals_conceded;
  @attr('number') goals_scored;
  @attr('number') ict_index;
  @attr('boolean') in_dreamteam;
  @attr('number') influence;
  @attr('number') minutes;
  @attr('number') own_goals;
  @attr('number') penalties_missed;
  @attr('number') penalties_saved;
  @attr('number') red_cards;
  @attr('number') saves;
  @attr('number') threat;
  @attr('number') total_points;
  @attr('number') yellow_cards;

  // Relationship

  @belongsTo('pro-player') player;
  @belongsTo('fantasy-pick') pick;
  @belongsTo('game-week') gameWeek;

  // Getters
  get pointsDescriptions() {
    const str = [];
    this.explain.forEach((e) => {
      if (e.stat === 'minutes') {
        if (e.points !== 0) {
          str.pushObject({ text: `${e.value} mins`, points: e.points });
        } else {
          str.pushObject({ text: `did not play` });
        }
      } else {
        if (e.stat === 'goals_conceded') {
          str.pushObject({
            text: `${e.value} goals conceded`,
            points: e.points,
          });
        } else {
          return str.pushObject({
            text: `${pluralize(e.value, singularize(e.name)).toLowerCase()}`,
            points: e.points,
          });
        }
      }
    });

    if (str.length === 0) {
      return ['Did not play'];
    } else {
      return str;
    }
  }

  get status() {
    const fixture = this.player.get('team.fixture');

    if (!fixture.started) {
      // game not started
      return APPEARANCE_STATUS.PENDING;
    } else if (this.minutes > 0 && fixture.finished) {
      // played
      return APPEARANCE_STATUS.PLAYED;
    } else if (fixture.started && this.minutes === 0) {
      // did not play
      return APPEARANCE_STATUS.BENCHED;
    } else {
      return APPEARANCE_STATUS.PLAYING;
    }
  }

  get color() {
    switch (this.status) {
      case APPEARANCE_STATUS.PENDING:
        return 'bg-cyan';
      case APPEARANCE_STATUS.PLAYED:
        return 'bg-lime';
      case APPEARANCE_STATUS.BENCHED:
        return 'bg-red';
      case APPEARANCE_STATUS.PLAYING:
        return 'bg-yellow';
    }
  }

  get description() {
    switch (this.status) {
      case APPEARANCE_STATUS.PENDING:
        return `${this.player.get('web_name')} pending`;
      case APPEARANCE_STATUS.PLAYED:
        return `${this.player.get('web_name')} played`;
      case APPEARANCE_STATUS.BENCHED:
        return `${this.player.get('web_name')} was benched`;
      case APPEARANCE_STATUS.PLAYING:
        return `${this.player.get('web_name')} currently playing`;
    }
  }
}
