import Model, { attr, belongsTo } from '@ember-data/model';

export default class FantasyPickModel extends Model {
  // Attributes

  @attr('boolean') is_captain;
  @attr('boolean') is_vice_captain;
  @attr('number') multiplier; // 1 in team / 0 on bench
  @attr('number') position;
  @attr('boolean') started_on_bench;

  // Relationships

  @belongsTo('pro-player') player;
  @belongsTo('fantasy-team') team;
  @belongsTo('game-week') gameWeek;
  @belongsTo('appearance', { inverse: 'pick' }) appearance;
}
