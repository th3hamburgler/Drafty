import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProPointsModel extends Model {
  // Attributes

  @attr('number') assists = 0;
  @attr('number') bonus = 0;
  @attr('number') bps = 7;
  @attr('number') clean_sheets = 0;
  @attr('number') creativity = 4.8;
  @attr('number') goals_conceded = 3;
  @attr('number') goals_scored = 0;
  @attr('number') ict_index = 1.3;
  @attr('boolean') in_dreamteam = false;
  @attr('number') influence = 8;
  @attr('number') minutes = 75;
  @attr('number') own_goals = 0;
  @attr('number') penalties_missed = 0;
  @attr('number') penalties_saved = 0;
  @attr('number') red_cards = 0;
  @attr('number') saves = 0;
  @attr('number') threat = 0;
  @attr('number') total_points = 1;
  @attr('number') yellow_cards = 0;

  // Relationship

  @belongsTo('pro-player') player;
}
