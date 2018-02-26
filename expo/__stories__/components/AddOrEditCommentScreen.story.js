/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";
import startOfToday from "date-fns/start_of_today";
import startOfYesterday from "date-fns/start_of_yesterday";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import addMinutes from "date-fns/add_minutes";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import AddOrEditCommentScreen from "../../src/screens/AddOrEditCommentScreen";

faker.seed(123);

const currentProfile = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const timestampEarlierToday = setMinutes(setHours(startOfToday(), 9), 41);
const timestampEarlierYesterday = setMinutes(
  setHours(startOfYesterday(), 9),
  41
);
const note = {
  id: "1",
  timestamp: timestampEarlierYesterday,
  messageText: `#note This is a note. ${faker.fake("{{lorem.paragraph}}")}`,
  userId: "1",
};
const timestampAddComment = timestampEarlierToday;
const commentsFetchData = {
  comments: [
    {
      id: "2",
      messageText: `This is comment 1 #hashtag. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: addMinutes(timestampEarlierYesterday, 60),
      userFullName: "Some other person",
    },
    {
      id: "3",
      messageText: `This is comment 2 #hashtag. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: timestampEarlierToday,
      userFullName: "Some other person",
    },
    {
      id: "4",
      messageText: `This is comment 3 #hashtag.`,
      timestamp: addMinutes(timestampEarlierToday, 60),
      userFullName: "Some other person",
    },
    {
      id: "5",
      messageText: `This is comment 4 #hashtag. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: addMinutes(timestampEarlierToday, 120),
      userFullName: "Some other person",
    },
    {
      id: "6",
      messageText: `This is comment 5 #hashtag. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: addMinutes(timestampEarlierToday, 180),
      userFullName: "Some other person",
    },
  ],
  fetching: false,
  fetched: true,
};
const navigateGoBack = () => {};
const commentAddAsync = () => {};
const commentUpdateAsync = () => {};

storiesOf("AddOrEditCommentScreen", module).add("add comment", () => (
  <StoryContainerScreen>
    <AddOrEditCommentScreen
      currentUser={currentProfile}
      currentProfile={currentProfile}
      commentsFetchData={commentsFetchData}
      note={note}
      timestampAddComment={timestampAddComment}
      navigateGoBack={navigateGoBack}
      commentAddAsync={commentAddAsync}
      commentUpdateAsync={commentUpdateAsync}
    />
  </StoryContainerScreen>
));

storiesOf("AddOrEditCommentScreen", module).add("edit first comment", () => (
  <StoryContainerScreen>
    <AddOrEditCommentScreen
      currentUser={currentProfile}
      currentProfile={currentProfile}
      commentsFetchData={commentsFetchData}
      note={note}
      comment={commentsFetchData.comments[0]}
      navigateGoBack={navigateGoBack}
      commentAddAsync={commentAddAsync}
      commentUpdateAsync={commentUpdateAsync}
    />
  </StoryContainerScreen>
));

storiesOf("AddOrEditCommentScreen", module).add(
  "edit comment in middle",
  () => (
    <StoryContainerScreen>
      <AddOrEditCommentScreen
        currentUser={currentProfile}
        currentProfile={currentProfile}
        commentsFetchData={commentsFetchData}
        note={note}
        comment={commentsFetchData.comments[2]}
        navigateGoBack={navigateGoBack}
        commentAddAsync={commentAddAsync}
        commentUpdateAsync={commentUpdateAsync}
      />
    </StoryContainerScreen>
  )
);

storiesOf("AddOrEditCommentScreen", module).add("edit last comment", () => (
  <StoryContainerScreen>
    <AddOrEditCommentScreen
      currentUser={currentProfile}
      currentProfile={currentProfile}
      commentsFetchData={commentsFetchData}
      note={note}
      comment={
        commentsFetchData.comments[commentsFetchData.comments.length - 1]
      }
      navigateGoBack={navigateGoBack}
      commentAddAsync={commentAddAsync}
      commentUpdateAsync={commentUpdateAsync}
    />
  </StoryContainerScreen>
));
