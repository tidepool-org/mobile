const apiCacheExpiration0Seconds = 0;
const apiCacheExpiration1Minute = 60;
const apiCacheExpiration5Minutes = 60 * 5;
const apiCacheExpiration180Days = 60 * 60 * 24 * 180;

const API_CACHE_EXPIRATION_0_SECONDS = "Cache for 0 seconds";
const API_CACHE_EXPIRATION_1_MINUTE = "Cache for 1 minute";
const API_CACHE_EXPIRATION_5_MINUTES = "Cache for 5 minutes";
const API_CACHE_EXPIRATION_180_DAYS = "Cache for 180 days";

class TidepoolApiCacheControl {
  constructor(cache) {
    this.cache = cache;
  }

  clear() {
    // Clear all collections
    this.cache.profileCollection.remove({}, { multi: true });
    this.cache.profileSettingsCollection.remove({}, { multi: true });
    this.cache.viewableUserProfilesCollection.remove({}, { multi: true });
    this.cache.notesCollection.remove({}, { multi: true });
    this.cache.commentsCollection.remove({}, { multi: true });
    this.cache.graphDataCollection.remove({}, { multi: true });
  }

  setCacheExpirationSeconds(expireAfterSeconds) {
    // Only expire notes, comments, graph data collections
    this.cache.notesCollection.removeIndex("updatedAt");
    this.cache.notesCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds,
    });
    this.cache.commentsCollection.removeIndex("updatedAt");
    this.cache.commentsCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds,
    });
    this.cache.graphDataCollection.removeIndex("updatedAt");
    this.cache.graphDataCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds,
    });
  }
}

function getApiCacheExpirationSecondsFromName(apiCacheExpiration) {
  let apiCacheExpirationSeconds;

  switch (apiCacheExpiration) {
    case API_CACHE_EXPIRATION_0_SECONDS:
      apiCacheExpirationSeconds = apiCacheExpiration0Seconds;
      break;
    case API_CACHE_EXPIRATION_1_MINUTE:
      apiCacheExpirationSeconds = apiCacheExpiration1Minute;
      break;
    case API_CACHE_EXPIRATION_5_MINUTES:
      apiCacheExpirationSeconds = apiCacheExpiration5Minutes;
      break;
    case API_CACHE_EXPIRATION_180_DAYS:
      apiCacheExpirationSeconds = apiCacheExpiration180Days;
      break;
    default:
      apiCacheExpirationSeconds = apiCacheExpiration180Days;
      // console.log(
      //   `Unknown apiCacheExpiration: ${apiCacheExpiration}, defaulting to ${API_CACHE_EXPIRATION_180_DAYS}`
      // );
      break;
  }

  return apiCacheExpirationSeconds;
}

export {
  TidepoolApiCacheControl,
  API_CACHE_EXPIRATION_0_SECONDS,
  API_CACHE_EXPIRATION_1_MINUTE,
  API_CACHE_EXPIRATION_5_MINUTES,
  API_CACHE_EXPIRATION_180_DAYS,
  getApiCacheExpirationSecondsFromName,
};
