import api from "../api";

import { commentsFetchAddComment } from "../actions/commentsFetch";

const COMMENT_ADD_DID_START = "COMMENT_ADD_DID_START";
const COMMENT_ADD_DID_SUCCEED = "COMMENT_ADD_DID_SUCCEED";
const COMMENT_ADD_DID_FAIL = "COMMENT_ADD_DID_FAIL";

const commentAddDidStart = ({ currentProfile, messageText, timestamp }) => ({
  type: COMMENT_ADD_DID_START,
  payload: { currentProfile, messageText, timestamp },
});

// TODO: animation - need to do some sort of distinct update animation
const commentAddDidSucceed = ({ comment }) => ({
  type: COMMENT_ADD_DID_SUCCEED,
  payload: { comment },
});

// TODO: Need reducer for this to display error alert and test it with failure .. consider moving errorMessage handling higher up the component hierarchy, especially if we're always just rendering it as an alert
const commentAddDidFail = ({ errorMessage }) => ({
  type: COMMENT_ADD_DID_FAIL,
  payload: { errorMessage },
});

const commentAddAsync = ({
  currentUser,
  currentProfile,
  note,
  messageText,
  timestamp,
}) => async dispatch => {
  dispatch(
    commentAddDidStart({ currentUser, currentProfile, messageText, timestamp })
  );

  const { errorMessage, comment } = await api().addCommentAsync({
    currentUser,
    currentProfile,
    note,
    messageText,
    timestamp,
  });

  if (errorMessage) {
    dispatch(commentAddDidFail({ errorMessage }));
  } else {
    dispatch(commentAddDidSucceed({ comment }));
    dispatch(
      commentsFetchAddComment({ note, comment, profile: currentProfile })
    );
  }
};

export {
  commentAddDidStart,
  commentAddDidSucceed,
  commentAddDidFail,
  commentAddAsync,
  COMMENT_ADD_DID_START,
  COMMENT_ADD_DID_SUCCEED,
  COMMENT_ADD_DID_FAIL,
};
