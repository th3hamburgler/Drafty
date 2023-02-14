import Model, { attr } from '@ember-data/model';

export default class LeagueModel extends Model {
  // Attributes
  @attr('number') admin_entry;
  @attr('boolean') closed;
  @attr('date') draft_dt;
  @attr('number') draft_pick_time_limit;
  @attr('string') draft_status;
  @attr('string') draft_tz_show;
  @attr('number') ko_rounds;
  @attr('boolean') make_code_public;
  @attr('number') max_entries;
  @attr('number') min_entries;
  @attr('string') name;
  @attr('string') scoring;
  @attr('number') start_event;
  @attr('number') stop_event;
  @attr('string') trades;
  @attr('string') transaction_mode;
  @attr('string') variety;
}
