import LeagueDetails from './fixtures/league-details';
import Live from './fixtures/live';
import BootstrapStatic from './fixtures/bootstrap-static';
import Entries from './fixtures/entries';
import Transactions from './fixtures/transactions';

import { createServer } from 'miragejs';
// import { Response } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    models: config.models,
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.namespace = '/api';
  this.timing = 5;

  // DRAFT API
  this.urlPrefix = 'https://draft.premierleague.com';

  // League Details
  this.get('/league/46575/details', () => {
    return LeagueDetails;
  });

  // Events Live
  this.get('/event/:game_week_id/live', (schema, request) => {
    const gameWeekId = request.params.game_week_id;
    return Live[gameWeekId];
  });

  // Entrys
  this.get('/entry/:team_id/event/:game_week_id', (schema, request) => {
    const gameWeekId = request.params.game_week_id,
      teamId = request.params.team_id;
    return Entries[teamId][gameWeekId];
  });

  // Transactions
  this.get('/draft/league/46575/transactions', () => {
    return Transactions;
  });

  // FANTASY API
  this.urlPrefix = 'https://fantasy.premierleague.com';

  this.get('/bootstrap-static', () => {
    return BootstrapStatic;
  });
}
