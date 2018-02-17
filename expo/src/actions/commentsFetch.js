import api from "../api";

export const COMMENTS_FETCH_DID_START = "COMMENTS_FETCH_DID_START";
export const COMMENTS_FETCH_DID_SUCCEED = "COMMENTS_FETCH_DID_SUCCEED";
export const COMMENTS_FETCH_DID_FAIL = "COMMENTS_FETCH_DID_FAIL";
export const COMMENTS_FETCH_ADD_COMMENT = "COMMENTS_FETCH_ADD_COMMENT";
export const COMMENTS_FETCH_UPDATE_COMMENT = "COMMENTS_FETCH_UPDATE_COMMENT";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

export const commentsFetchDidStart = ({ messageId }) => ({
  type: COMMENTS_FETCH_DID_START,
  payload: { messageId },
});

export const commentsFetchDidSucceed = ({ messageId, comments }) => ({
  type: COMMENTS_FETCH_DID_SUCCEED,
  payload: { messageId, comments },
});

export const commentsFetchDidFail = ({ messageId, errorMessage }) => ({
  type: COMMENTS_FETCH_DID_FAIL,
  payload: { messageId, errorMessage },
});

export const commentsFetchAsync = ({ messageId }) => async dispatch => {
  dispatch(commentsFetchDidStart({ messageId }));

  const { comments, errorMessage } = await api().fetchCommentsAsync({
    messageId,
  });

  if (errorMessage) {
    dispatch(commentsFetchDidFail({ messageId, errorMessage }));
  } else {
    dispatch(commentsFetchDidSucceed({ messageId, comments }));
  }
};

export const commentsFetchAddComment = ({ note, comment, profile }) => ({
  type: COMMENTS_FETCH_ADD_COMMENT,
  payload: { note, comment, profile },
});

export const commentsFetchUpdateComment = ({ note, comment, profile }) => ({
  type: COMMENTS_FETCH_UPDATE_COMMENT,
  payload: { note, comment, profile },
});
