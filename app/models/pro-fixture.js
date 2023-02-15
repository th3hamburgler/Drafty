import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProFixtureModel extends Model {
  // Attributes

  @attr('number') code;
  @attr('number') event;
  @attr('boolean') finished;
  @attr('boolean') finished_provisional;
  @attr('date') kickoff_time;
  @attr('number') minutes;
  @attr('boolean') provisional_start_time;
  @attr('number') pulse_id;
  @attr('boolean') started;
  @attr() stats;
  @attr('number') team_a_score;
  @attr('number') team_h_score;

  // Relationships

  @belongsTo('pro_team') home;
  @belongsTo('pro_team') away;
}
