import Model, { attr, belongsTo } from '@ember-data/model';

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
}
