import { API_CACHE_EXPIRATION_SET } from "../actions/apiCacheExpiration";
import { API_CACHE_EXPIRATION_180_DAYS } from "../api/TidepoolApiCacheControl";

const initialApiCacheExpirationState = API_CACHE_EXPIRATION_180_DAYS;

function apiCacheExpiration(state = initialApiCacheExpirationState, action) {
  switch (action.type) {
    case API_CACHE_EXPIRATION_SET:
      return action.payload;
    default:
      return state;
  }
}

export default apiCacheExpiration;
