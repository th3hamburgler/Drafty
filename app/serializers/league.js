import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class LeagueSerializer extends JSONAPISerializer {
  // Methods
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // console.log(payload, id, requestType);

    // if (requestType === findRecord) {

    // }

    const normalizedPayload = {
      data: {
        id,
        type: 'league',
        attributes: payload.league,
      },
    };

    console.log(normalizedPayload);

    return super.normalizeResponse(
      store,
      primaryModelClass,
      normalizedPayload,
      id,
      requestType
    );
  }
}
