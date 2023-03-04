import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { singularize, pluralize } from 'ember-inflector';

const APPEARANCE_STATUS = {
  PENDING: 'pending',
  PLAYED: 'played',
  BENCHED: 'benched',
  PLAYING: 'playing',
  NONE: 'none',
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
  @hasMany('pro-fixture') fixtures;

  // Getters

  get canBeSubbedOut() {
    // console.log('canBeSubbedOut', this.finished, this.minutes);
    // will return true if this player can be subbed out of a fantasy team
    // return this.finished && this.minutes === 0;
    const status = this.status;

    return this.minutes === 0 && this.gamesFinished;
  }

  get canBeSubbedIn() {
    // will return true if this player can be subbed in to a fantasy team
    // return this.finished && this.minutes > 0;
    return this.minutes > 0;
  }

  get pointsDescriptions() {
    const str = [];
    if (this.explain) {
      const status = this.status;
      this.explain.forEach((e) => {
        if (e.stat === 'minutes') {
          if (e.points !== 0) {
            str.pushObject({ text: `${e.value} mins`, points: e.points });
          } else if (status === APPEARANCE_STATUS.PENDING) {
            str.pushObject({ text: `game pending` });
          } else if (status === APPEARANCE_STATUS.BENCHED) {
            str.pushObject({ text: `not started` });
          } else if (status === APPEARANCE_STATUS.PLAYING) {
            str.pushObject({ text: `game underway` });
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
    }

    if (str.length === 0) {
      return ['Did not play'];
    } else {
      return str;
    }
  }

  get status() {
    const fixture = this.get('fixture');

    if (this.gameNotStarted) {
      // game not started
      return APPEARANCE_STATUS.PENDING;
    } else if (this.minutes > 0 && this.gamesFinished) {
      // played
      return APPEARANCE_STATUS.PLAYED;
    } else if (this.gameStarted && this.minutes === 0) {
      // did not play
      return APPEARANCE_STATUS.BENCHED;
    } else if (this.hasNoGames) {
      return APPEARANCE_STATUS.NONE;
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
      case APPEARANCE_STATUS.NONE:
        return 'bg-black opacity-30';
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
        return `${this.player.get('web_name')} is playing`;
      case APPEARANCE_STATUS.NONE:
        return `${this.player.get('web_name')} has no games`;
    }
  }

  get hasNoGames() {
    return this.fixtures.length === 0;
  }

  get gameNotStarted() {
    if (this.hasNoGames) {
      return false;
    }
    // return true if any of the fixtures linked to this appearance have not started yet
    return this.fixtures.any((f) => {
      return !f.started;
    });
  }

  get gameStarted() {
    if (this.hasNoGames) {
      return false;
    }
    return this.fixtures.any((f) => {
      return f.started;
    });
  }

  get gameNotFinished() {
    if (this.hasNoGames) {
      return false;
    }
    // return true if any of the fixtures linked to this appearance have not finished yet
    return this.fixtures.any((f) => {
      return !f.finished;
    });
  }

  get gamesFinished() {
    if (this.hasNoGames) {
      return true;
    }
    // true if all fixtures this game week have finished
    return this.fixtures.every((f) => {
      return f.finished;
    });
  }
}
