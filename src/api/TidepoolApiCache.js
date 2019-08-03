import Datastore from "react-native-local-mongodb";

/* eslint-disable no-bitwise */
function jsonSize(s) {
  return ~-encodeURI(JSON.stringify(s)).split(/%..|./).length;
}
/* eslint-enable no-bitwise */

class TidepoolApiCache {
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

  async calculateEstimatedSizeInBytes() {
    let totalSize = 0;

    await this.notesCollection.find({}, (err, docs) => {
      if (docs.length) {
        totalSize += docs.reduce((size, doc) => {
          return size + jsonSize(doc);
        }, 0);
      }
    });
    await this.commentsCollection.find({}, (err, docs) => {
      if (docs.length) {
        totalSize += docs.reduce((size, doc) => {
          return size + jsonSize(doc);
        }, 0);
      }
    });
    await this.graphDataCollection.find({}, (err, docs) => {
      if (docs.length) {
        totalSize += docs.reduce((size, doc) => {
          return size + jsonSize(doc);
        }, 0);
      }
    });

    return totalSize;
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
        return { userId, profile, isAvailableOffline: true };
      }
      return {
        userId,
        profile: {},
        isAvailableOffline: false,
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
          isAvailableOffline: true,
        };
      }

      const errorMessage = "No profile settings available offline";
      return {
        userId,
        errorMessage,
        isAvailableOffline: false,
      };
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
        return { userId, notes, isAvailableOffline: true };
      }
      return { userId, notes: [], isAvailableOffline: false };
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
        return { comments, isAvailableOffline: true };
      }
      return { comments: [], isAvailableOffline: false };
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
        return { profiles, isAvailableOffline: true };
      }
      return { profiles: [], isAvailableOffline: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }

  async saveGraphDataAsync({ userId, messageId, responseData }) {
    try {
      await this.graphDataCollection.updateAsync(
        { userId, messageId },
        { userId, messageId, responseData },
        { upsert: true }
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  async fetchGraphDataAsync({ userId, messageId }) {
    try {
      const doc = await this.graphDataCollection.findOneAsync({
        userId,
        messageId,
      });
      if (doc) {
        const { responseData } = doc;
        return { responseData, isAvailableOffline: true };
      }
      return { responseData: [], isAvailableOffline: false };
    } catch (error) {
      const errorMessage = error.message;
      // console.log({ errorMessage });
      return { errorMessage };
    }
  }
}

export { TidepoolApiCache };
