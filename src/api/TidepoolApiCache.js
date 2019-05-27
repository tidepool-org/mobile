import Datastore from "react-native-local-mongodb";

class TidepoolApiCacheSingleton {
  constructor() {
    const config = {
      autoload: true,
      timestampData: true,
      corruptAlertThreshold: 0,
    };
    this.profileCollection = new Datastore({
      filename: "profileCollection",
      ...config,
    });
    this.profileSettingsCollection = new Datastore({
      filename: "profileSettingsCollection",
      ...config,
    });
    this.viewableUserProfilesCollection = new Datastore({
      filename: "viewableUserProfilesCollection",
      ...config,
    });
    this.notesCollection = new Datastore({
      filename: "notesCollection",
      ...config,
    });
    this.commentsCollection = new Datastore({
      filename: "commentsCollection",
      ...config,
    });
    this.graphDataCollection = new Datastore({
      filename: "graphDataCollection",
      ...config,
    });
  }

  // async trim() {} // TODO: Add support for trimming old items

  async clear() {
    this.profileCollection.remove({}, { multi: true });
    this.profileSettingsCollection.remove({}, { multi: true });
    this.viewableUserProfilesCollection.remove({}, { multi: true });
    this.notesCollection.remove({}, { multi: true });
    this.commentsCollection.remove({}, { multi: true });
    this.graphDataCollection.remove({}, { multi: true });
  }

  async saveProfileAsync({ userId, profile }) {
    try {
      await this.profileCollection.updateAsync(
        { userId },
        { userId, profile },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchProfileAsync({ userId }) {
    try {
      const doc = await this.profileCollection.findOneAsync({ userId });
      if (doc) {
        const { profile } = doc;
        return { userId, profile, offlineAvailable: true };
      }
      return {
        userId,
        profile: {},
        offlineAvailable: false,
        errorMessage: "Profile not available offline, this is unexpected!",
      };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveProfileSettingsAsync({ userId, settings }) {
    try {
      await this.profileSettingsCollection.updateAsync(
        { userId },
        { userId, settings },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchProfileSettingsAsync({ userId }) {
    try {
      const doc = await this.profileSettingsCollection.findOneAsync({ userId });
      if (doc) {
        const { settings } = doc;
        return {
          userId,
          settings,
          offlineAvailable: true,
        };
      }
      return { userId, settings: {}, offlineAvailable: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveNotesAsync({ userId, notes }) {
    try {
      await this.notesCollection.updateAsync(
        { userId },
        { userId, notes },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchNotesAsync({ userId }) {
    try {
      const doc = await this.notesCollection.findOneAsync({ userId });
      if (doc) {
        const { notes } = doc;
        return { userId, notes, offlineAvailable: true };
      }
      return { userId, notes: [], offlineAvailable: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveCommentsAsync({ messageId, comments }) {
    try {
      await this.commentsCollection.updateAsync(
        { messageId },
        { messageId, comments },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchCommentsAsync({ messageId }) {
    try {
      const doc = await this.commentsCollection.findOneAsync({ messageId });
      if (doc) {
        const { comments } = doc;
        return { comments, offlineAvailable: true };
      }
      return { comments: [], offlineAvailable: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveViewableUserProfilesAsync({ userId, profiles }) {
    try {
      await this.viewableUserProfilesCollection.updateAsync(
        { userId },
        { userId, profiles },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchViewableUserProfilesAsync({ userId }) {
    try {
      const doc = await this.viewableUserProfilesCollection.findOneAsync({
        userId,
      });
      if (doc) {
        const { profiles } = doc;
        return { profiles, offlineAvailable: true };
      }
      return { profiles: [], offlineAvailable: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveGraphDataAsync({
    userId,
    noteDate,
    startDate,
    endDate,
    responseData,
  }) {
    try {
      await this.graphDataCollection.updateAsync(
        { userId, noteDate, startDate, endDate },
        { userId, noteDate, startDate, endDate, responseData },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchGraphDataAsync({ userId, noteDate, startDate, endDate }) {
    try {
      const doc = await this.graphDataCollection.findOneAsync({
        userId,
        noteDate,
        startDate,
        endDate,
      });
      if (doc) {
        const { responseData } = doc;
        return { responseData, offlineAvailable: true };
      }
      return { responseData: [], offlineAvailable: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }
}

const TidepoolApiCache = new TidepoolApiCacheSingleton();

export { TidepoolApiCache };
