import Route from '@ember/routing/route';

export default class LiveRoute extends Route {
  queryParams = {
    week: {
      refreshModel: true,
    },
  };
}
