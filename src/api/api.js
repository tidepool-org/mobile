import { NativeModules } from "react-native";

import { TidepoolApi } from "./TidepoolApi";
import Logger from "../models/Logger";

const API_ENVIRONMENT_PRODUCTION = "Production";
const API_ENVIRONMENT_INTEGRATION = "Integration";
const API_ENVIRONMENT_QA2 = "QA2";
const API_ENVIRONMENT_QA1 = "QA1";

const BASE_URL_PRODUCTION = "https://app.tidepool.org";
const BASE_URL_INTEGRATION = "https://int.tidepool.org";
const BASE_URL_QA2 = "https://qa2.development.tidepool.org";
const BASE_URL_QA1 = "https://qa1.development.tidepool.org";

let tidepoolApi = {};

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
    case API_ENVIRONMENT_QA2:
      baseUrl = BASE_URL_QA2;
      break;
    case API_ENVIRONMENT_QA1:
      baseUrl = BASE_URL_QA1;
      break;
    default:
      baseUrl = BASE_URL_PRODUCTION;
      break;
  }

  tidepoolApi = new TidepoolApi({ baseUrl });

  Logger.updateRollbarWithConfig({ environment: apiEnvironment });

  try {
    const { NativeNotifications } = NativeModules;
    NativeNotifications.setEnvironment(apiEnvironment);
  } catch (error) {
    // console.log(`error: ${error}`);
  }
};

const api = () => tidepoolApi;

export {
  api as default,
  API_ENVIRONMENT_PRODUCTION,
  API_ENVIRONMENT_INTEGRATION,
  API_ENVIRONMENT_QA2,
  API_ENVIRONMENT_QA1,
  switchApiEnvironment,
};
