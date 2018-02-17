import api from "../api";

import { commentsFetchUpdateComment } from "../actions/commentsFetch";

export const COMMENT_UPDATE_DID_START = "COMMENT_UPDATE_DID_START";
export const COMMENT_UPDATE_DID_SUCCEED = "COMMENT_UPDATE_DID_SUCCEED";
export const COMMENT_UPDATE_DID_FAIL = "COMMENT_UPDATE_DID_FAIL";

export const commentUpdateDidStart = ({ comment }) => ({
  type: COMMENT_UPDATE_DID_START,
  payload: { comment },
});

// TODO: animation - need to do some sort of distinct update animation
export const commentUpdateDidSucceed = ({ comment }) => ({
  type: COMMENT_UPDATE_DID_SUCCEED,
  payload: { comment },
});

export const commentUpdateDidFail = ({ comment, errorMessage }) => ({
  type: COMMENT_UPDATE_DID_FAIL,
  payload: { comment, errorMessage },
});

export const commentUpdateAsync = ({
  note,
  comment,
  currentProfile,
}) => async dispatch => {
  dispatch(commentUpdateDidStart({ comment }));

  const { errorMessage } = await api().updateCommentAsync({ comment });

  if (errorMessage) {
    dispatch(commentUpdateDidFail({ comment, errorMessage }));
  } else {
    dispatch(commentUpdateDidSucceed({ comment }));
    dispatch(
      commentsFetchUpdateComment({ note, comment, profile: currentProfile })
    );
  }
};
