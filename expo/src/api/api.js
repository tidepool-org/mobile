import TidepoolApi from "./TidepoolApi";

const API_ENVIRONMENT_PRODUCTION = "Production";
const API_ENVIRONMENT_INTEGRATION = "Integration";
const API_ENVIRONMENT_STAGING = "Staging";
const API_ENVIRONMENT_DEVELOPMENT = "Development";

const BASE_URL_PRODUCTION = "https://api.tidepool.org";
const BASE_URL_INTEGRATION = "https://int-api.tidepool.org";
const BASE_URL_STAGING = "https://stg-api.tidepool.org";
const BASE_URL_DEVELOPMENT = "https://dev-api.tidepool.org";

let tidepoolApi = null;

const switchApiEnvironment = apiEnvironment => {
  // console.log(`switchApiEnvironment: ${apiEnvironment}`);

  let baseUrl;

  switch (apiEnvironment) {
    case API_ENVIRONMENT_PRODUCTION:
      baseUrl = BASE_URL_PRODUCTION;
      break;
    case API_ENVIRONMENT_INTEGRATION:
      baseUrl = BASE_URL_INTEGRATION;
      break;
    case API_ENVIRONMENT_STAGING:
      baseUrl = BASE_URL_STAGING;
      break;
    case API_ENVIRONMENT_DEVELOPMENT:
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
  API_ENVIRONMENT_PRODUCTION,
  API_ENVIRONMENT_INTEGRATION,
  API_ENVIRONMENT_STAGING,
  API_ENVIRONMENT_DEVELOPMENT,
  switchApiEnvironment,
};
