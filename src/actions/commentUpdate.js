import { api } from "../api";

import { commentsFetchUpdateComment } from "./commentsFetch";

const COMMENT_UPDATE_DID_START = "COMMENT_UPDATE_DID_START";
const COMMENT_UPDATE_DID_SUCCEED = "COMMENT_UPDATE_DID_SUCCEED";
const COMMENT_UPDATE_DID_FAIL = "COMMENT_UPDATE_DID_FAIL";

const commentUpdateDidStart = ({ comment }) => ({
  type: COMMENT_UPDATE_DID_START,
  payload: { comment },
});

// TODO: animation - need to do some sort of distinct update animation
const commentUpdateDidSucceed = ({ comment }) => ({
  type: COMMENT_UPDATE_DID_SUCCEED,
  payload: { comment },
});

const commentUpdateDidFail = ({ comment, errorMessage }) => ({
  type: COMMENT_UPDATE_DID_FAIL,
  payload: { comment, errorMessage },
});

const commentUpdateAsync = ({
  note,
  comment,
  currentProfile,
}) => async dispatch => {
  dispatch(commentUpdateDidStart({ comment }));

  const { errorMessage } = await api().updateCommentAsync({ note, comment });

  if (errorMessage) {
    dispatch(commentUpdateDidFail({ comment, errorMessage }));
  } else {
    dispatch(commentUpdateDidSucceed({ comment }));
    dispatch(
      commentsFetchUpdateComment({ note, comment, profile: currentProfile })
    );
  }
};

export {
  commentUpdateDidStart,
  commentUpdateDidSucceed,
  commentUpdateDidFail,
  commentUpdateAsync,
  COMMENT_UPDATE_DID_START,
  COMMENT_UPDATE_DID_SUCCEED,
  COMMENT_UPDATE_DID_FAIL,
};
