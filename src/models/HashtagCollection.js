import twitter from "twitter-text";

class HashtagCollection {
  static defaultHashtags = [
    "#exercise",
    "#meal",
    "#sitechange",
    "#sensorchange",
    "#juicebox",
    "#devicesetting",
  ];

  hashtagsSortedByCount = [];
  hashtagsWithCountSortedByCount = [];
  hashtagsWithCountMap = new Map();

  constructor() {
    this.resetToDefaultHashtags();
  }

  resetToDefaultHashtags() {
    this.reset();
    this.addDefaultHashtagsToMap();
    this.updateSortedHashtags();
  }

  reloadHashtagsForObjectsWithText({ objectsWithText, textPropertyName }) {
    this.reset();
    if (objectsWithText && objectsWithText.length > 0) {
      objectsWithText.forEach(objectWithText => {
        this.addHashtagsForTextToMap(objectWithText[textPropertyName]);
      });
    }
    this.addDefaultHashtagsToMap();
    this.updateSortedHashtags();
  }

  updateHashtagsForText({
    objectWithTextToRemove,
    objectWithTextToAdd,
    textPropertyName,
  }) {
    if (objectWithTextToAdd) {
      this.addHashtagsForTextToMap(objectWithTextToAdd[textPropertyName]);
    }
    if (objectWithTextToRemove) {
      this.removeHashtagsForTextFromMap(
        objectWithTextToRemove[textPropertyName]
      );
    }
    this.updateSortedHashtags();
  }

  // Private

  reset() {
    this.hashtagsSortedByCount = [];
    this.hashtagsWithCountSortedByCount = [];
    this.hashtagsWithCountMap = new Map();
  }

  updateSortedHashtags() {
    this.hashtagsWithCountSortedByCount = Array.from(this.hashtagsWithCountMap);
    this.hashtagsWithCountSortedByCount.sort(
      (hashtagWithCount1, hashtagWithCount2) => {
        const count1 = hashtagWithCount1[1];
        const count2 = hashtagWithCount2[1];
        if (count2 > count1) {
          return 1;
        } else if (count2 < count1) {
          return -1;
        }
        return 0;
      }
    );
    this.hashtagsSortedByCount = this.hashtagsWithCountSortedByCount.map(
      hashtagWithCount => hashtagWithCount[0]
    );
  }

  addDefaultHashtagsToMap() {
    HashtagCollection.defaultHashtags.forEach(hashtag => {
      this.addHashtagToMap(hashtag);
    });
  }

  addHashtagsForTextToMap(text) {
    const extractedHashtags = twitter.extractHashtags(text);
    extractedHashtags.forEach(hashtag => {
      this.addHashtagToMap(`#${hashtag}`);
    });
  }

  removeHashtagsForTextFromMap(text) {
    const extractedHashtags = twitter.extractHashtags(text);
    extractedHashtags.forEach(hashtag => {
      this.removeHashtagFromMap(`#${hashtag}`);
    });
  }

  addHashtagToMap(hashtag) {
    const count = this.hashtagsWithCountMap.get(hashtag) || 0;
    this.hashtagsWithCountMap.set(hashtag, count + 1);
  }

  removeHashtagFromMap(hashtag) {
    const count = this.hashtagsWithCountMap.get(hashtag);
    if (count) {
      if (count > 1) {
        this.hashtagsWithCountMap.set(hashtag, count - 1);
      } else {
        this.hashtagsWithCountMap.delete(hashtag);
      }
    }
  }
}

export default HashtagCollection;
