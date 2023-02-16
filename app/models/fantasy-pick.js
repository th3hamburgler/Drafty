import Model, { attr, belongsTo } from '@ember-data/model';

export default class FantasyPickModel extends Model {
  // Attributes

  @attr('boolean') is_captain;
  @attr('boolean') is_vice_captain;
  @attr('number') multiplier;
  @attr('number') position;

  @belongsTo('pro-player') player;
  @belongsTo('fantasy-team') team;
  @belongsTo('game-week') gameWeek;
}
