/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import HashtagCollection from "../src/models/HashtagCollection";

it("has default hashtags for new collection", () => {
  const hashtagCollection = new HashtagCollection();
  const {
    hashtagsWithCountSortedByCount,
    hashtagsWithCountMap,
  } = hashtagCollection;

  expect(hashtagsWithCountSortedByCount.length).toBeGreaterThan(0);
  expect(hashtagsWithCountMap.size).toBeGreaterThan(0);
  expect(hashtagsWithCountSortedByCount.length).toEqual(
    hashtagsWithCountMap.size
  );
});

it("has same snapshot default hashtags for new collection", () => {
  const hashtagCollection = new HashtagCollection();
  const {
    hashtagsWithCountSortedByCount,
    hashtagsWithCountMap,
  } = hashtagCollection;

  expect(hashtagsWithCountSortedByCount).toMatchSnapshot();
  expect(hashtagsWithCountMap).toMatchSnapshot();
});

it("sorts hashtags by count", () => {
  const hashtagCollection = new HashtagCollection();
  hashtagCollection.updateHashtagsForText({
    objectWithTextToAdd: { text: "#hash2 #hash2 #hash1 #hash1 #hash1 #hash3" },
    textPropertyName: "text",
  });

  const { hashtagsWithCountSortedByCount } = hashtagCollection;
  expect(hashtagsWithCountSortedByCount[0][0]).toEqual("#hash1");
  expect(hashtagsWithCountSortedByCount[1][0]).toEqual("#hash2");
});

it("deletes hashtags", () => {
  const hashtagCollection = new HashtagCollection();
  hashtagCollection.updateHashtagsForText({
    objectWithTextToAdd: { text: "#hash2 #hash2 #hash1 #hash1 #hash1 #hash3" },
    textPropertyName: "text",
  });
  hashtagCollection.updateHashtagsForText({
    objectWithTextToRemove: {
      text: "#hash2 #hash2 #hash1 #hash1 #hash1 #hash3",
    },
    textPropertyName: "text",
  });
  hashtagCollection.updateHashtagsForText({
    objectWithTextToAdd: { text: "#hash2 #hash2 #hash1 #hash1 #hash1 #hash3" },
    textPropertyName: "text",
  });

  const { hashtagsWithCountSortedByCount } = hashtagCollection;
  expect(hashtagsWithCountSortedByCount[0][0]).toEqual("#hash1");
  expect(hashtagsWithCountSortedByCount[0][1]).toEqual(3);
});

it("updates hashtags", () => {
  const hashtagCollection = new HashtagCollection();
  const originalObject = { text: "#hash2 #hash2 #hash1 #hash1 #hash1 #hash3" };
  hashtagCollection.updateHashtagsForText({
    objectWithTextToAdd: originalObject,
    textPropertyName: "text",
  });
  const newObject = { text: "#hash2 #hash1 #hash1 #hash3" };
  hashtagCollection.updateHashtagsForText({
    objectWithTextToRemove: originalObject,
    objectWithTextToAdd: newObject,
    textPropertyName: "text",
  });

  const { hashtagsWithCountSortedByCount } = hashtagCollection;
  expect(hashtagsWithCountSortedByCount[0][0]).toEqual("#hash1");
  expect(hashtagsWithCountSortedByCount[0][1]).toEqual(2);
});
