import Model, { attr, hasMany } from '@ember-data/model';

export default class ProTeamModel extends Model {
  // Attributes

  @attr('number') code;
  @attr('number') draw;
  @attr('number') form;
  @attr('number') loss;
  @attr('string') name;
  @attr('number') played;
  @attr('number') points;
  @attr('number') position;
  @attr('number') pulse_id;
  @attr('string') short_name;
  @attr('number') strength;
  @attr('number') strength_attack_away;
  @attr('number') strength_attack_home;
  @attr('number') strength_defence_away;
  @attr('number') strength_defence_home;
  @attr('number') strength_overall_away;
  @attr('number') strength_overall_home;
  @attr('number') team_division;
  @attr('boolean') unavailable;
  @attr('number') win;

  // Relationships

  @hasMany('pro-player') players;
}
