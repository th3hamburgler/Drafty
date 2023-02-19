import Model, { attr, hasMany } from '@ember-data/model';

export default class GameWeekModel extends Model {
  // Attributes

  @attr('number') average_entry_score;
  @attr() chip_plays;
  @attr('boolean') cup_leagues_created;
  @attr('boolean') data_checked;
  @attr('date') deadline_time;
  @attr('number') deadline_time_epoch;
  @attr('number') deadline_time_game_offset;
  @attr('boolean') finished;
  @attr('boolean') h2h_ko_matches_created;
  @attr('number') highest_score;
  @attr('number') highest_scoring_entry;
  @attr('boolean') is_current;
  @attr('boolean') is_next;
  @attr('boolean') is_previous;
  @attr('number') most_captained;
  @attr('number') most_selected;
  @attr('number') most_transferred_in;
  @attr('number') most_vice_captained;
  @attr('string') name;
  @attr('number') top_element;
  @attr() top_element_info;
  @attr('number') transfers_made;

  // Relationships
  @hasMany('fantasy-fixture') fantasyFixtures;
  @hasMany('fantasy-pick') picks;
}
