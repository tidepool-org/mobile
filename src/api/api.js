import { TidepoolApi } from "./TidepoolApi";
import { Logger } from "../models/Logger";
import { TPNative } from "../models/TPNative";

const API_ENVIRONMENT_PRODUCTION = "Production";
const API_ENVIRONMENT_STAGING = "Staging";
const API_ENVIRONMENT_DEVELOPMENT = "Development";

const BASE_URL_PRODUCTION = "https://api.tidepool.org";
const BASE_URL_STAGING = "https://qa2.development.tidepool.org";
const BASE_URL_DEVELOPMENT = "https://qa1.development.tidepool.org";

let tidepoolApi = {};

const switchApiEnvironment = apiEnvironment => {
  // console.log(`switchApiEnvironment: ${apiEnvironment}`);

  let baseUrl;

  switch (apiEnvironment) {
    case API_ENVIRONMENT_PRODUCTION:
      baseUrl = BASE_URL_PRODUCTION;
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

  TPNative.setEnvironment(apiEnvironment);
  Logger.updateRollbarWithConfig({ environment: apiEnvironment });
};

const api = () => tidepoolApi;

export {
  api,
  API_ENVIRONMENT_PRODUCTION,
  API_ENVIRONMENT_STAGING,
  API_ENVIRONMENT_DEVELOPMENT,
  switchApiEnvironment,
};
