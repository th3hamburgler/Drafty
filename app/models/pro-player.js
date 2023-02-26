import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProPlayerModel extends Model {
  // Attributes

  @attr('number') code;
  @attr('string') first_name;
  @attr('string') second_name;
  @attr('string') web_name;
  @attr('string') total_points;
  @attr('number') code;
  @attr('number') now_cost;

  // Relationships

  @belongsTo('position') position;
  @belongsTo('pro-team') team;
  @hasMany('appearance') appearances;
  @hasMany('fantasy-pick') picks;
}
