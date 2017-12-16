import TidepoolApi from "./TidepoolApi";

const ENVIRONMENT_PRODUCTION = "Production";
const ENVIRONMENT_STAGING = "Staging";
const ENVIRONMENT_INTEGRATION = "Integration";
const ENVIRONMENT_DEVELOPMENT = "Development";

const BASE_URL_PRODUCTION = "https://api.tidepool.org";
const BASE_URL_STAGING = "https://stg-api.tidepool.org";
const BASE_URL_INTEGRATION = "https://int-api.tidepool.org";
const BASE_URL_DEVELOPMENT = "https://dev-api.tidepool.org";

let tidepoolApi = null;

const switchEnvironment = environment => {
  let baseUrl;

  switch (environment) {
    case ENVIRONMENT_PRODUCTION:
      baseUrl = BASE_URL_PRODUCTION;
      break;
    case ENVIRONMENT_STAGING:
      baseUrl = BASE_URL_STAGING;
      break;
    case ENVIRONMENT_INTEGRATION:
      baseUrl = BASE_URL_INTEGRATION;
      break;
    case ENVIRONMENT_DEVELOPMENT:
      baseUrl = BASE_URL_DEVELOPMENT;
      break;
    default:
      baseUrl = BASE_URL_PRODUCTION;
      break;
  }

  tidepoolApi = new TidepoolApi({ baseUrl });
};

const api = () => tidepoolApi;

export {
  api as default,
  ENVIRONMENT_PRODUCTION,
  ENVIRONMENT_STAGING,
  ENVIRONMENT_INTEGRATION,
  ENVIRONMENT_DEVELOPMENT,
  switchEnvironment,
};

// TODO: api - this should default to what was last used, using AsyncStorage
// TODO: api - probably should defer this to clients, rather than calling here
switchEnvironment(ENVIRONMENT_STAGING);
