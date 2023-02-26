import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, all, waitForProperty, timeout } from 'ember-concurrency';
import axios from 'axios';
import config from 'drafty/config/environment';
import Entries from 'drafty/data/entries';
import Live from 'drafty/data/live';
import { ExponentialBackoffPolicy } from 'ember-concurrency-retryable';
import { addListener, removeListener } from '@ember/object/events';
import { registerDestructor } from '@ember/destroyable';

const backoffPolicy = new ExponentialBackoffPolicy({
  multiplier: 1.5,
  minDelay: 30,
  maxDelay: 400,
});

const ACCESS_KEY = 'f9a0d214fd6ea502e71561e1117c5f0d',
  PROXY =
    config.environment === 'production'
      ? `https://api.scrapestack.com/scrape?access_key=${ACCESS_KEY}&url=`
      : `https://api.scrapestack.com/scrape?access_key=${ACCESS_KEY}&url=`,
  DRAFT_API = `${PROXY}https://draft.premierleague.com/api`,
  FPL_API = `${PROXY}https://fantasy.premierleague.com/api`,
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

  @tracked pickId = 0;
  @tracked appearanceId = 0;
  @tracked fixtureId = 0;

  // Getters

  get currentGameWeek() {
    const gameWeek = this.gameWeeks.find((week) => {
      return week.is_current;
    });

    if (gameWeek) {
      return gameWeek;
    }
    return { id: 1 };
  }

  get standings() {
    return this.fantasyStandings.toArray();
  }

  get leader() {
    return this.standings.firstObject;
  }

  get looser() {
    return this.standings.lastObject;
  }

  get flatTrackBullyTotals() {
    // Sort with highest points p score

    const sorted = this.fantasyStandings.toArray().sort((a, b) => {
      if (a.pointsDifference < b.pointsDifference) {
        return 1;
      } else if (a.pointsDifference > b.pointsDifference) {
        return -1;
      } else if (a.pointsDifference < b.pointsDifference) {
        return 1;
      } else if (a.pointsDifference > b.pointsDifference) {
        return -1;
      } else {
        return 0;
      }
    });

    return sorted;
  }

  get flatTrackBully() {
    const standings = this.flatTrackBullyTotals;

    return standings.firstObject;
  }

  get tinkerManTotals() {
    // Sort with highest number of transactions
    return this.fantasyStandings
      .toArray()
      .sortBy('team.totalTransactions')
      .reverse();
  }

  get tinkerMan() {
    return this.tinkerManTotals.firstObject;
  }

  get asleepTotals() {
    return this.fantasyStandings.toArray().sortBy('team.totalTransactions');
  }

  get asleep() {
    // Sort with lowest number of transactions
    return this.asleepTotals.firstObject;
  }

  get benchWarmerTotals() {
    return this.fantasyTeams.toArray().sortBy('totalLostBenchPoints').reverse();
  }

  get benchWarmer() {
    return this.benchWarmerTotals.firstObject;
  }

  get changingRoomTotals() {
    return this.fantasyTeams.toArray().sortBy('totalNegativePoints');
  }

  get changingRoom() {
    return this.changingRoomTotals.firstObject;
  }

  get luckyManTotals() {
    return this.fantasyStandings.toArray().sortBy('points_against');
  }
  get luckyMan() {
    return this.luckyManTotals.firstObject;
  }

  get cantBuyAGoalTotal() {
    return this.fantasyTeams.toArray().sortBy('totalTeamGoals');
  }
  get cantBuyAGoal() {
    return this.cantBuyAGoalTotal.firstObject;
  }

  get wastedKeeperTotals() {
    return this.fantasyTeams.toArray().sortBy('wastedKeeperPoints').reverse();
  }

  get wastedKeeper() {
    return this.wastedKeeperTotals.firstObject;
  }

  get theWallTotals() {
    return this.fantasyTeams.toArray().sortBy('totalCleanSheets').reverse();
  }
  get theWall() {
    return this.theWallTotals.firstObject;
  }

  get loyalTotals() {
    return this.fantasyTeams
      .toArray()
      .sortBy('numberOfOriginalSquadPlayers')
      .reverse();
  }

  get loyal() {
    return this.loyalTotals.firstObject;
  }

  // Tasks

  bootstrap = task({ retryable: backoffPolicy }, async () => {
    try {
      await this.getBootstrap.perform();

      await waitForProperty(this, 'getBootstrap.isIdle');

      // await this.getMatches.perform(this.currentGameWeek.id);

      await this.getLeagueData.perform();

      // Loop over game weeks for each team and collect their fantasy picks
      this.fantasyTeams.forEach((team) => {
        this.gameWeeks.forEach(async (week) => {
          // Ignore game weeks in the future
          if (parseInt(week.id) <= parseInt(this.currentGameWeek.id)) {
            await this.getTeamData.perform(team, week.id);
          }
        });
      });

      await waitForProperty(this, 'getTeamData.isIdle');

      // Loop over game weeks and collect pro player appearance data
      this.gameWeeks.forEach(async (week) => {
        // Ignore game weeks in the future
        if (parseInt(week.id) <= parseInt(this.currentGameWeek.id)) {
          await this.getMatches.perform(week.id);
        }
      });

      // Transactions
      await this.getTransactions.perform();

      return this;
    } catch (e) {
      console.log('Error thrown in bootstrap task', e);
      throw Error(e);
    }
  });

  getBootstrap = task({ retryable: backoffPolicy }, async () => {
    try {
      // console.log('Task: getBootstrap start');
      const result = await axios.get(BOOTSTRAP_STATIC);
      if (!result.data) {
        console.log(result);
        throw new Error('Did not get payload');
      }
      // console.log('Task: getBootstrap resolve');
      this.gameWeeks = this.normalizeGameWeeks(result.data.events);
      this.positions = this.normalizePositions(result.data.element_types);
      this.proTeams = this.normalizeTeams(result.data.teams);
      this.proPlayers = this.normalizeProPlayers(result.data.elements);
    } catch (e) {
      console.log('Error thrown in getBootstrap task', e);
      throw new Error(e);
    }
  });

  getMatches = task({ retryable: backoffPolicy }, async (gameWeekId) => {
    try {
      // console.log('Task: getMatches start');
      let result;

      if (Live && Live[gameWeekId]) {
        result = { data: Live[gameWeekId] };
      } else {
        result = await axios.get(
          EVENTS_LIVE.replace(':game_week_id', gameWeekId)
        );
        if (!result.data) {
          console.log(result);
          throw new Error('Did not get payload');
        }
      }

      // console.log('Task: getMatches resolve');

      this.proFixtures = [
        ...this.proFixtures,
        ...this.normalizeFixtures(result.data, this.proTeams, gameWeekId),
      ];

      this.proPoints = this.normalizePoints(result.data, gameWeekId);
    } catch (e) {
      console.log('Error thrown in getMatches task', e);
      throw new Error(e);
    }
  });

  getLeagueData = task({ retryable: backoffPolicy }, async () => {
    try {
      // console.log('Task: getLeagueData start');
      const result = await axios.get(LEAGUE_DETAILS_API);

      if (!result.data) {
        console.log(result);
        throw new Error('Did not get payload');
      }

      // console.log('Task: getLeagueData resolve');
      this.fantasyLeague = this.normalizeLeague(result.data.league);
      this.fantasyTeams = this.normalizeFantasyTeams(
        result.data.league_entries
      );
      this.fantasyStandings = this.normalizeStandings(result.data.standings);
      this.fantasyFixtures = this.normalizeFantasyFixtures(result.data.matches);

      return true;
    } catch (e) {
      console.log('Error thrown in getLeagueData task', e);
      throw new Error(e);
    }
  });

  getTeamData = task({ retryable: backoffPolicy }, async (team, gameWeekId) => {
    try {
      // console.log('Task: getTeamData start');

      // We need to make 100s of these requests during the season
      // so let's just cache old weeks data and load the json directly
      // if we have it.
      let result;

      if (
        Entries &&
        Entries[team.entry_id] &&
        Entries[team.entry_id][gameWeekId]
      ) {
        result = { data: Entries[team.entry_id][gameWeekId] };
      } else {
        const url = PICKS.replace(':manager_id', team.entry_id).replace(
          ':event_id',
          gameWeekId
        );

        result = await axios.get(url);
        if (!result.data) {
          console.log(result);
          throw new Error('Did not get payload');
        }
      }
      // console.log('Task: getTeamData resolve');

      const gameWeek = this.store.peekRecord('game-week', gameWeekId);
      const picks = this.normalizePicks(result.data, team, gameWeek);
      this.fantasyPicks.addObjects(picks);

      return true;
    } catch (e) {
      console.log('Error thrown in getTeamData task', e);
      throw new Error(e);
    }
  });

  getTransactions = task(
    { retryable: backoffPolicy },
    async (team, gameWeekId) => {
      try {
        // console.log('Task: getTransactions start');

        const result = await axios.get(TRANSACTIONS);
        if (!result.data) {
          console.log(result);
          throw new Error('Did not get payload');
        }

        // console.log('Task: getTransactions resolve');
        this.transactions = this.normalizeTransactions(
          result.data.transactions
        );

        return true;
      } catch (e) {
        console.log('Error thrown in getTransactions task', e);
        throw new Error(e);
      }
    }
  );

  // Methods

  constructor() {
    super(...arguments);
    addListener(this, 'getLeagueData:started', this, this.onTaskStarted);
    addListener(this, 'getLeagueData:retrying', this, this.onTaskRetrying);
    addListener(this, 'getLeagueData:retried', this, this.onTaskRetried);
    addListener(this, 'getLeagueData:succeeded', this, this.onTaskSucceeded);
    addListener(this, 'getLeagueData:errored', this, this.onTaskErrored);

    registerDestructor(this, () => {
      removeListener(this, 'getLeagueData:started', this, this.onTaskStarted);
      removeListener(this, 'getLeagueData:retrying', this, this.onTaskRetrying);
      removeListener(this, 'getLeagueData:retried', this, this.onTaskRetried);
      removeListener(
        this,
        'getLeagueData:succeeded',
        this,
        this.onTaskSucceeded
      );
      removeListener(this, 'getLeagueData:errored', this, this.onTaskErrored);
    });
  }

  onTaskStarted(taskInstance) {
    const [id] = taskInstance.args;
    console.log(id, `Task ${id}: making AJAX request`);
  }

  onTaskRetrying(taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    console.log(id, `Task ${id}: retrying request (${retryCount})`);
  }

  onTaskRetried(taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    console.log(
      id,
      `Task ${id}: request succeeded after ${retryCount + 1} tries`
    );
  }

  onTaskSucceeded(taskInstance) {
    const [id] = taskInstance.args;
    console.log(id, `Task ${id}: AJAX done`);
  }

  onTaskErrored(taskInstance, error) {
    const [id] = taskInstance.args;
    console.log(id, `Task ${id}: AJAX failed because of '${error.message}'`);
  }

  normalizeGameWeeks(weeks) {
    try {
      // console.log('normalizeGameWeeks');
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
    } catch (e) {
      console.log('Error thrown in normalizeGameWeeks', e);
    }
  }

  normalizePositions(positions) {
    try {
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
    } catch (e) {
      console.log('Error thrown in normalizePositions', e);
    }
  }

  normalizeTeams(teams) {
    try {
      // console.log('normalizeTeams');
      return teams.map((team) => {
        const id = team.id;
        delete team.id;

        return this.store.push({
          data: [
            {
              id: id,
              type: 'pro-team',
              attributes: team,
              relationships: {},
            },
          ],
        }).firstObject;
      });
    } catch (e) {
      console.log('Error thrown in normalizeTeams', e);
    }
  }

  normalizeProPlayers(proPlayers) {
    try {
      // console.log('normalizeProPlayers');

      return proPlayers.map((p) => {
        const id = parseInt(p.id),
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
              type: 'pro-player',
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
    } catch (e) {
      console.log('Error thrown in normalizeProPlayers', e);
    }
  }

  normalizeFixtures(payload, proTeams, gameWeekId) {
    try {
      // console.log('normalizeFixtures');
      return payload.fixtures.map((fixture) => {
        const id = fixture.id;
        const homeId = fixture.team_h;
        const awayId = fixture.team_a;

        delete fixture.id;
        delete fixture.team_h;
        delete fixture.team_a;

        const home = this.store.peekRecord('pro-team', homeId);
        const away = this.store.peekRecord('pro-team', awayId);
        const gameWeek = this.store.peekRecord('game-week', gameWeekId);

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
        model.gameWeek = gameWeek;

        return model;
      });
    } catch (e) {
      console.log('Error thrown in normalizeFixtures', payload, e);
    }
  }

  groupPicksByGameWeekAndPlayer(picks) {
    const groupedPicks = {};

    for (let i = 0; i < picks.length; i++) {
      const pick = picks[i];
      const gameWeekId = pick.get('gameWeek.id');
      const playerId = pick.get('player.id');

      if (!groupedPicks[gameWeekId]) {
        groupedPicks[gameWeekId] = {};
      }

      if (!groupedPicks[gameWeekId][playerId]) {
        groupedPicks[gameWeekId][playerId] = [];
      }

      groupedPicks[gameWeekId][playerId] = pick;
    }

    return groupedPicks;
  }

  normalizePoints(payload, gameWeekId) {
    try {
      // console.log('normalizePoints');

      const allAppearances = [];

      // Cache picks by gameweek and then player so we dont have
      // to do an expensize find in the loops below
      const picks = this.groupPicksByGameWeekAndPlayer(
        this.store.peekAll('fantasy-pick')
      );

      // do the same with pro fixtures
      const gameWeekFixtures = this.store.peekAll('pro-fixture').filter((f) => {
        return f.get('gameWeek.id') === gameWeekId;
      });

      Object.keys(payload.elements).forEach((playerId) => {
        const appearances = [payload.elements[playerId]];

        appearances.forEach((appearance) => {
          const explain = appearance?.explain?.firstObject?.firstObject;

          //

          const pick = picks[gameWeekId][playerId];

          if (pick) {
            this.appearanceId++;
            const id = this.appearanceId;

            const player = this.store.peekRecord('pro-player', playerId);
            const gameWeek = this.store.peekRecord('game-week', gameWeekId);
            const fixtures = gameWeekFixtures.filter((f) => {
              // check if this teams player is involved
              return (
                f.get('home.id') === player.get('team.id') ||
                f.get('away.id') === player.get('team.id')
              );
            });

            const model = this.store.push({
              data: [
                {
                  id: id,
                  type: 'appearance',
                  attributes: { ...appearance.stats, explain: explain },
                  relationships: {},
                },
              ],
            }).firstObject;

            if (player) {
              model.player = player;
            }

            model.gameWeek = gameWeek;
            model.pick = pick;
            model.fixtures = fixtures;

            allAppearances.pushObject(model);
          }
        });
      });

      return allAppearances;
    } catch (e) {
      console.log('Error thrown in normalizePoints', e);
    }
  }

  normalizeLeague(league) {
    try {
      // console.log('normalizeLeague');

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
    } catch (e) {
      console.log('Error thrown in normalizeLeague', e);
    }
  }

  normalizeFantasyTeams(teams) {
    try {
      // console.log('normalizeFantasyTeams');

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
      console.log('Error thrown in normalizeFantasyTeams', e);
    }
  }

  normalizeStandings(standings) {
    try {
      // console.log('normalizeStandings');
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
    } catch (e) {
      console.log('Error thrown in normalizeStandings', e);
    }
  }

  normalizeFantasyFixtures(fixtures) {
    try {
      // console.log('normalizeFantasyFixtures');

      return fixtures.map((fixture) => {
        const gameWeekId = fixture.event,
          homeId = fixture.league_entry_1,
          awayId = fixture.league_entry_2;

        this.fixtureId++;
        const id = this.fixtureId;

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
    } catch (e) {
      console.log('Error thrown in normalizeFantasyFixtures', e);
    }
  }

  normalizePicks(payload, fantasyTeam, gameWeek) {
    try {
      const picks = payload.picks.map((pick, index) => {
        this.pickId++;
        const id = this.pickId,
          proPlayerId = parseInt(pick.element);

        delete pick.element;

        const player = this.store.peekRecord('pro-player', proPlayerId);

        // const appearance = this.store.peekAll('appearance').find((app) => {
        //   const id = parseInt(app.get('player.id')),
        //     gw = parseInt(app.get('gameWeek.id'));

        //   // find the appearance of this player on the given game week
        //   return id === proPlayerId && gw === parseInt(gameWeek.id);
        // });

        // assign a 0 multiplier to any subs when the game week began
        // it looks like the draft api always assigns 1 to this property
        if (index > 10) {
          pick.multiplier = 0;
          pick.started_on_bench = true;
        } else {
          pick.started_on_bench = false;
        }

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
        // model.appearance = appearance;
        // console.log('===', model.get('player.web_name'), appearance.id);

        return model;
      });

      // Now we must loop through the subs data to see if any players
      // were subbed into the team this week
      payload.subs.forEach((s) => {
        const playerIn = picks.find((p) => {
          // console.log(p.get('player.id'), s.element_in);
          return parseInt(p.get('player.id')) === parseInt(s.element_in);
        });
        const playerOut = picks.find((p) => {
          // console.log(p.get('player.id'), s.element_out);
          return parseInt(p.get('player.id')) === parseInt(s.element_out);
        });

        // set player in multiplier to 1
        if (playerIn) {
          playerIn.multiplier = 1;
        }
        // set player out multipler to 0
        if (playerOut) {
          playerOut.multiplier = 0;
        }
      });

      return picks;
    } catch (e) {
      console.log('Error thrown in normalizePicks', e);
    }
  }

  normalizeTransactions(transactions) {
    try {
      // console.log('normalizeTransactions');
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
    } catch (e) {
      console.log('Error thrown in normalizeTransactions', e);
    }
  }

  gameWeekFantasyFixtures(gameWeek) {
    return this.fantasyFixtures.filter((f) => {
      return f.gameWeek.get('id') === gameWeek.id;
    });
  }

  getSimilarFixtures(current) {
    return this.store.peekAll('fantasy-fixture').filter((fixture) => {
      return (
        (current.get('home.id') == fixture.get('home.id') &&
          current.get('away.id') == fixture.get('away.id')) ||
        (current.get('home.id') == fixture.get('away.id') &&
          current.get('away.id') == fixture.get('home.id'))
      );
    });
  }
}
