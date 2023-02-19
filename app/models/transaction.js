import Model, { attr, belongsTo } from '@ember-data/model';

export default class TransactionModel extends Model {
  // Attributes

  @attr('date') added;
  @attr('number') index;
  @attr('number') kind;
  @attr('number') priority;
  @attr('number') result;

  // Relationships

  @belongsTo('fantasy-team') team;
  @belongsTo('pro-player') playerIn;
  @belongsTo('pro-player') playerOut;
  @belongsTo('game-week') gameWeek;
}
