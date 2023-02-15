import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import axios from 'axios';
import { isArray } from '@ember/array';

const DRAFT_API = 'https://draft.premierleague.com/api',
  FPL_API = 'https://fantasy.premierleague.com/api',
  LEAGUE_DETAILS_API = `${DRAFT_API}/league/46575/details`,
  GAME_API = `${DRAFT_API}/game`,
  LEAGUE_ELEMENTS = `${DRAFT_API}/league/46575/element-status`,
  EVENTS_LIVE = `${DRAFT_API}/event/23/live`,
  BOOTSTRAP_STATIC = `${FPL_API}/bootstrap-static/`,
  FIXTURES = `${FPL_API}/fixtures`,
  PICKS = `${DRAFT_API}/entry/:manager_id/event/23`;

export default class FplApiService extends Service {
  // Services

  @service() store;

  // Tracked

  @tracked gameWeeks = [];
  @tracked positions = [];

  @tracked proTeams = [];
  @tracked proPlayers = [];
  @tracked proFixtures = [];

  @tracked proPoints = [];

  @tracked fantasyTeams = [];
  @tracked fantasyPlayers = [];
  @tracked fantasyFixtures = [];

  // Getters

  get loading() {
    return this.getBootstrap.isRunning && this.getLiveMatches.isRunning;
  }

  // Tasks
  @task(function* (/*params*/) {
    try {
      const result = yield axios.get(BOOTSTRAP_STATIC);

      this.gameWeeks = result.data.events;
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
      const result = yield axios.get(EVENTS_LIVE);

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

  // Methods

  bootstrap() {
    console.log('bootstrap');
    this.getBootstrap.perform();
    this.getLiveMatches.perform();
    return this;
  }

  normalizePoints(payload) {
    console.log('normalizePoints');

    const allAppearances = [];

    Object.keys(payload.elements).forEach((playerId) => {
      const appearances = [payload.elements[playerId]];

      appearances.forEach((appearance) => {
        console.log(appearance.explain.firstObject.firstObject);

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

      // if (player) {
      //   // points.player = player;
      //   player.points = points;
      // } else {
      //   // console.log('no player', playerId);
      // }
    });

    return allAppearances;
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
            relationships: {
              // pro_players: {
              //   data: [
              //     {
              //       id: positionId,
              //       type: 'position',
              //     },
              //   ],
              // },
            },
          },
        ],
        // included: [],
      }).firstObject;

      model.position = position;
      model.team = team;

      return model;
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

  // async getLiveMatches() {
  //   try {
  //     const result = await axios.get(EVENTS_LIVE),
  //       fixtures = this.normalizeFixtures(result.data);

  //     return { fixtures };
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // async getLeagueData() {
  //   try {
  //     const result = await axios.get(LEAGUE_DETAILS_API),
  //       league = this.normalizeLeague(result.data),
  //       matches = this.normalizeMatches(result.data),
  //       standings = this.normalizeStandings(result.data);

  //     return { league, matches, standings };
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async getPlayerData() {
    try {
    } catch (e) {
      console.log(e);
    }
  }

  normalizeLeague(payload) {
    return payload.league;
  }

  normalizeStandings(payload) {
    const entries = payload.league_entries,
      standings = payload.standings.map((s) => {
        s.entry = entries.findBy('id', s.league_entry);
        return s;
      });
    return standings;
  }

  normalizeMatches(payload) {
    try {
      const entries = payload.league_entries,
        matches = payload.matches.map((m) => {
          m.league_entry_1 = entries.findBy('id', m.league_entry_1);
          m.league_entry_2 = entries.findBy('id', m.league_entry_2);

          if (m.league_entry_1_points > m.league_entry_2_points) {
            m.league_entry_1_winning = true;
            m.league_entry_2_winning = false;
          } else if (m.league_entry_1_points < m.league_entry_2_points) {
            m.league_entry_1_winning = false;
            m.league_entry_2_winning = true;
          } else {
            m.league_entry_1_winning = false;
            m.league_entry_2_winning = false;
          }

          return m;
        });
      return matches;
    } catch (e) {
      console.log(e);
    }
  }
}
