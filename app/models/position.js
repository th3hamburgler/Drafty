import Model, { attr, hasMany } from '@ember-data/model';

export default class PositionModel extends Model {
  // Attributes

  @attr('string') elementCount;
  @attr('string') plural_name;
  @attr('string') plural_name_short;
  @attr('string') singular_name;
  @attr('string') singular_name_short;
  @attr('string') squad_max_play;
  @attr('string') squad_min_play;
  @attr('string') squad_select;
  @attr('string') sub_positions_locked;
  @attr('string') ui_shirt_specific;

  // Relationships

  @hasMany('pro-player') players;

  // Aliases

  get playerCount() {
    return this.elementCount;
  }
}
