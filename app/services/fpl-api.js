import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, all } from 'ember-concurrency';
import axios from 'axios';
import { isArray } from '@ember/array';

const DRAFT_API = 'https://draft.premierleague.com/api',
  FPL_API = 'https://fantasy.premierleague.com/api',
  LEAGUE_DETAILS_API = `${DRAFT_API}/league/46575/details`,
  GAME_API = `${DRAFT_API}/game`,
  LEAGUE_ELEMENTS = `${DRAFT_API}/league/46575/element-status`,
  EVENTS_LIVE = `${DRAFT_API}/event/:game_week_id/live`,
  BOOTSTRAP_STATIC = `${FPL_API}/bootstrap-static/`,
  FIXTURES = `${FPL_API}/fixtures`,
  PICKS = `${DRAFT_API}/entry/:manager_id/event/:event_id`,
  TRANSACTIONS = `${DRAFT_API}/draft/league/46575/transactions`;

export default class FplApiService extends Service {
  // Services

  @service() store;

  // Tracked

  @tracked gameWeeks = [];
  @tracked positions = [];
  @tracked transactions = [];

  @tracked proTeams = [];
  @tracked proPlayers = [];
  @tracked proFixtures = [];

  @tracked proPoints = [];

  @tracked fantasyTeams = [];
  @tracked fantasyStandings = [];
  @tracked fantasyFixtures = [];
  @tracked fantasyLeague = null;
  @tracked fantasyPicks = [];

  // Getters

  get loading() {
    return (
      this.getBootstrap.isRunning &&
      this.getLiveMatches.isRunning &&
      this.getLeagueData.isRunning &&
      this.getTeamData.isRunning &&
      this.getTransactions.isRunning
    );
  }

  get currentGameWeek() {
    if (this.loading) {
      return;
    }
    const gameWeek = this.gameWeeks.find((week) => {
      return week.is_current;
    });

    if (gameWeek) {
      return gameWeek;
    }
    return { id: 1 };
  }

  get currentFantasyFixtures() {
    if (this.loading) {
      return [];
    }
    const currentGameWeek = this.currentGameWeek;

    return this.fantasyFixtures.filter((f) => {
      return f.gameWeek.get('id') === currentGameWeek.id;
    });
  }

  get leader() {
    if (this.loading) {
      return;
    }
    const standing = this.fantasyStandings[0];
    return standing;
  }

  get looser() {
    if (this.loading) {
      return;
    }
    const standing = this.fantasyStandings[9];
    return standing;
  }

  get flatTrackBully() {
    // Sort with highest points p score
    return this.fantasyStandings.toArray().sortBy('pointsPerScore').lastObject;
  }

  get tinkerMan() {
    // Sort with highest number of transactions
    return this.fantasyStandings.toArray().sortBy('team.totalTransactions')
      .lastObject;
  }

  get asleep() {
    // Sort with lowest number of transactions
    return this.fantasyStandings.toArray().sortBy('team.totalTransactions')
      .firstObject;
  }

  // Tasks

  @task(function* (/*params*/) {
    try {
      const result = yield axios.get(BOOTSTRAP_STATIC);

      this.gameWeeks = this.normalizeGameWeeks(result.data.events);
      this.positions = this.normalizePositions(result.data.element_types);
      this.proTeams = this.normalizeTeams(result.data.teams);
      this.proPlayers = this.normalizeProPlayers(result.data.elements);

      return true;
    } catch (e) {
      console.log(e);
    }
  })
  getBootstrap;

  @task(function* (/*params*/) {
    try {
      const result = yield axios.get(
        EVENTS_LIVE.replace(':game_week_id', this.currentGameWeek.id)
      );

      this.proFixtures = yield this.normalizeFixtures(
        result.data,
        this.proTeams
      );
      this.proPoints = yield this.normalizePoints(result.data, this.proPlayers);
      return true;
    } catch (e) {
      console.log(e);
    }
  })
  getLiveMatches;

  @task(function* (/*params*/) {
    try {
      const result = yield axios.get(LEAGUE_DETAILS_API);

      this.fantasyLeague = this.normalizeLeague(result.data.league);
      this.fantasyTeams = this.normalizeFantasyTeams(
        result.data.league_entries
      );
      this.fantasyStandings = this.normalizeStandings(result.data.standings);
      this.fantasyFixtures = this.normalizeFantasyFixtures(result.data.matches);

      return true;
    } catch (e) {
      console.log(e);
    }
  })
  getLeagueData;

  @task(function* (team, gameWeekId) {
    try {
      const result = yield axios.get(
        PICKS.replace(':manager_id', team.entry_id).replace(
          ':event_id',
          gameWeekId
        )
      );

      const gameWeek = this.store.peekRecord('game-week', gameWeekId);

      this.fantasyPicks.addObjects(
        this.normalizePicks(result.data, team, gameWeek)
      );

      return true;
    } catch (e) {
      console.log(e);
    }
  })
  getTeamData;

  @task(function* (/*params*/) {
    try {
      const result = yield axios.get(TRANSACTIONS);

      this.transactions = this.normalizeTransactions(result.data.transactions);

      return true;
    } catch (e) {
      console.log(e);
    }
  })
  getTransactions;

  // Methods

  async bootstrap() {
    console.log('bootstrap');
    await this.getBootstrap.perform();
    await this.getLiveMatches.perform();
    await this.getLeagueData.perform();

    // get picks
    const teams = [];
    this.fantasyTeams.map((team) => {
      this.getTeamData.perform(team, this.currentGameWeek.id);
    });

    await all(teams);

    await this.getTransactions.perform();

    return this;
  }

  normalizeGameWeeks(weeks) {
    console.log('normalizeGameWeeks');
    return weeks.map((week) => {
      const id = week.id;
      delete week.id;

      return this.store.push({
        data: [
          {
            id: id,
            type: 'game-week',
            attributes: week,
            relationships: {},
          },
        ],
      }).firstObject;
    });
  }

  normalizePositions(positions) {
    return positions.map((position) => {
      const id = position.id;
      delete position.id;

      return this.store.push({
        data: [
          {
            id: id,
            type: 'position',
            attributes: position,
            relationships: {},
          },
        ],
      }).firstObject;
    });
  }

  normalizeTeams(teams) {
    console.log('normalizeTeams');
    return teams.map((team) => {
      const id = team.id;
      delete team.id;

      return this.store.push({
        data: [
          {
            id: id,
            type: 'pro_team',
            attributes: team,
            relationships: {},
          },
        ],
      }).firstObject;
    });
  }

  normalizeProPlayers(proPlayers) {
    console.log('normalizeProPlayers');

    return proPlayers.map((p) => {
      const id = p.id,
        positionId = p.element_type,
        teamId = p.team;

      delete p.id;
      delete p.element_type;
      delete p.team;

      const position = this.store.peekRecord('position', positionId);
      const team = this.store.peekRecord('pro-team', teamId);

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'pro_player',
            attributes: p,
            relationships: {},
          },
        ],
        // included: [],
      }).firstObject;

      model.position = position;
      model.team = team;

      return model;
    });
  }

  normalizeFixtures(payload, proTeams) {
    console.log('normalizeFixtures');
    return payload.fixtures.map((fixture) => {
      const id = fixture.id;
      const homeId = fixture.team_h;
      const awayId = fixture.team_a;

      delete fixture.id;
      delete fixture.team_h;
      delete fixture.team_a;

      const home = this.store.peekRecord('pro-team', homeId);
      const away = this.store.peekRecord('pro-team', awayId);

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'pro-fixture',
            attributes: fixture,
            relationships: {},
          },
        ],
      }).firstObject;

      model.home = home;
      model.away = away;

      return model;
    });
  }

  normalizePoints(payload) {
    console.log('normalizePoints');

    const allAppearances = [];

    Object.keys(payload.elements).forEach((playerId) => {
      const appearances = [payload.elements[playerId]];

      appearances.forEach((appearance) => {
        const explain = appearance.explain.firstObject.firstObject;

        const player = this.store.peekRecord('pro-player', playerId);

        const model = this.store.push({
          data: [
            {
              id: playerId,
              type: 'appearance',
              attributes: { ...appearance.stats, explain: explain },
              relationships: {},
            },
          ],
        }).firstObject;

        if (player) {
          model.player = player;
        }

        allAppearances.pushObject(model);
      });
    });

    return allAppearances;
  }

  normalizeLeague(league) {
    console.log('normalizeLeague');

    const id = league.id;
    delete league.id;

    return this.store.push({
      data: [
        {
          id: id,
          type: 'fantasy-league',
          attributes: league,
          relationships: {},
        },
      ],
    }).firstObject;
  }

  normalizeFantasyTeams(teams) {
    try {
      console.log('normalizeFantasyTeams');

      return teams.map((team) => {
        const id = team.id;
        delete team.id;

        return this.store.push({
          data: [
            {
              id: id,
              type: 'fantasy-team',
              attributes: team,
              relationships: {},
            },
          ],
        }).firstObject;
      });
    } catch (e) {
      console.log(e);
    }
  }

  normalizeStandings(standings) {
    console.log('normalizeStandings');
    return standings.map((standing) => {
      const id = standing.league_entry,
        teamId = standing.league_entry;

      delete standing.league_entry;

      const team = this.store.peekRecord('fantasy-team', teamId);

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'fantasy-standing',
            attributes: standing,
            relationships: {},
          },
        ],
      }).firstObject;

      model.team = team;

      return model;
    });
  }

  normalizeFantasyFixtures(fixtures) {
    console.log('normalizeFantasyFixtures');

    return fixtures.map((fixture) => {
      const gameWeekId = fixture.event,
        homeId = fixture.league_entry_1,
        awayId = fixture.league_entry_2,
        id = `${gameWeekId}${homeId}${awayId}`;

      delete fixture.event;
      delete fixture.league_entry_1;
      delete fixture.league_entry_2;

      const home = this.store.peekRecord('fantasy-team', homeId);
      const away = this.store.peekRecord('fantasy-team', awayId);
      const gameWeek = this.store.peekRecord('game-week', gameWeekId);

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'fantasy-fixture',
            attributes: fixture,
            relationships: {},
          },
        ],
      }).firstObject;

      model.home = home;
      model.away = away;
      model.gameWeek = gameWeek;

      return model;
    });
  }

  normalizePicks(payload, fantasyTeam, gameWeek) {
    console.log('normalizePicks');

    return payload.picks.map((pick) => {
      const id = pick.element,
        proPlayerId = pick.element;

      delete pick.element;

      const player = this.store.peekRecord('pro-player', proPlayerId);
      const appearance = this.store.peekAll('appearance').find((app) => {
        return parseInt(app.get('player.id')) === proPlayerId;
      });

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'fantasy-pick',
            attributes: pick,
            relationships: {},
          },
        ],
      }).firstObject;

      model.player = player;
      model.team = fantasyTeam;
      model.gameWeek = gameWeek;
      model.appearance = appearance;

      return model;
    });
  }

  normalizeTransactions(transactions) {
    console.log('normalizeTransactions');
    return transactions.map((transaction) => {
      const id = transaction.id,
        proPlayerInId = transaction.element_in,
        proPlayerOutId = transaction.element_out,
        gameWeekId = transaction.event,
        fantasyTeamAdminEntry = transaction.entry;

      delete transaction.element;
      delete transaction.element_in;
      delete transaction.element_out;
      delete transaction.event;
      delete transaction.entry;

      const playerIn = this.store.peekRecord('pro-player', proPlayerInId);
      const playerOut = this.store.peekRecord('pro-player', proPlayerOutId);
      const fantasyTeam = this.store.peekAll('fantasy-team').find((team) => {
        return team.entry_id === fantasyTeamAdminEntry;
      });
      const gameWeek = this.store.peekRecord('game-week', gameWeekId);

      const model = this.store.push({
        data: [
          {
            id: id,
            type: 'transaction',
            attributes: transaction,
            relationships: {},
          },
        ],
      }).firstObject;

      model.playerIn = playerIn;
      model.playerOut = playerOut;
      model.team = fantasyTeam;
      model.gameWeek = gameWeek;

      return model;
    });
  }
}
