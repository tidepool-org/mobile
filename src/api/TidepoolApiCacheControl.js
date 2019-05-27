class TidepoolApiCacheControl {
  constructor(cache) {
    this.cache = cache;

    // Automatically prune notes, comments, and graphData when TidepoolApiCacheControl is created
    this.prune();
  }

  clear() {
    this.cache.profileCollection.remove({}, { multi: true });
    this.cache.profileSettingsCollection.remove({}, { multi: true });
    this.cache.viewableUserProfilesCollection.remove({}, { multi: true });
    this.cache.notesCollection.remove({}, { multi: true });
    this.cache.commentsCollection.remove({}, { multi: true });
    this.cache.graphDataCollection.remove({}, { multi: true });
  }

  prune() {
    const twoWeeksSeconds = 60 * 60 * 24 * 14;
    this.cache.notesCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds: twoWeeksSeconds,
    });
    this.cache.commentsCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds: twoWeeksSeconds,
    });
    this.cache.graphDataCollection.ensureIndex({
      fieldName: "updatedAt",
      expireAfterSeconds: twoWeeksSeconds,
    });
  }
}

export { TidepoolApiCacheControl };
