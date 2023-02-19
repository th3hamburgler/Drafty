// import JSONAPIAdapter from '@ember-data/adapter/json-api';
import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  // Properties

  host = 'https://draft.premierleague.com';
  namespace = 'api';

  // Methods

  pathForType(type) {
    return type;
  }

  keyForAttribute(key) {
    console.log(key);
    return key;
  }
}
