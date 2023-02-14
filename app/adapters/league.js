import ApplicationAdapter from './application';

export default class LeagueAdapter extends ApplicationAdapter {
  buildURL(modelName, id, snapshot, requestType, query) {
    const url = super.buildURL(modelName, id, snapshot, requestType, query);
    return `${url}/details`;
  }
}
