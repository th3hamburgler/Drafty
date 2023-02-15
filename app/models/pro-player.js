import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProPlayerModel extends Model {
  // Attributes

  @attr('string') code;
  @attr('string') first_name;
  @attr('string') second_name;
  @attr('string') web_name;
  @attr('string') total_points;
  @attr('number') code;
  @attr('number') now_cost;

  // Relationships

  @belongsTo('position') position;
}
