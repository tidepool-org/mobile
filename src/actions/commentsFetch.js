import api from "../api";
import ConnectionStatus from "../models/ConnectionStatus";

const COMMENTS_FETCH_DID_START = "COMMENTS_FETCH_DID_START";
const COMMENTS_FETCH_DID_SUCCEED = "COMMENTS_FETCH_DID_SUCCEED";
const COMMENTS_FETCH_DID_FAIL = "COMMENTS_FETCH_DID_FAIL";
const COMMENTS_FETCH_ADD_COMMENT = "COMMENTS_FETCH_ADD_COMMENT";
const COMMENTS_FETCH_UPDATE_COMMENT = "COMMENTS_FETCH_UPDATE_COMMENT";
const COMMENTS_FETCH_DELETE_COMMENT = "COMMENTS_FETCH_DELETE_COMMENT";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

const commentsFetchDidStart = ({ messageId }) => ({
  type: COMMENTS_FETCH_DID_START,
  payload: { messageId },
});

const commentsFetchDidSucceed = ({ messageId, comments }) => ({
  type: COMMENTS_FETCH_DID_SUCCEED,
  payload: { messageId, comments },
});

const commentsFetchDidFail = ({ messageId, errorMessage }) => ({
  type: COMMENTS_FETCH_DID_FAIL,
  payload: { messageId, errorMessage },
});

const commentsFetchAsync = ({ messageId }) => async dispatch => {
  const fetchParams = {
    messageId,
  };
  const {
    comments: offlineComments,
    isAvailableOffline,
  } = await api().fetchCommentsAsync(
    fetchParams,
    true // fetchOnlyFromCache
  );

  if (isAvailableOffline) {
    dispatch(commentsFetchDidSucceed({ messageId, comments: offlineComments }));
  }

  if (ConnectionStatus.isOnline) {
    if (!isAvailableOffline) {
      dispatch(commentsFetchDidStart({ messageId }));
    }

    const { comments, errorMessage } = await api().fetchCommentsAsync(
      fetchParams
    );

    if (errorMessage) {
      dispatch(commentsFetchDidFail({ messageId, errorMessage }));
    } else {
      dispatch(commentsFetchDidSucceed({ messageId, comments }));
    }
  }
};

const commentsFetchAddComment = ({ note, comment, profile }) => ({
  type: COMMENTS_FETCH_ADD_COMMENT,
  payload: { note, comment, profile },
});

const commentsFetchUpdateComment = ({ note, comment, profile }) => ({
  type: COMMENTS_FETCH_UPDATE_COMMENT,
  payload: { note, comment, profile },
});

const commentsFetchDeleteComment = ({ note, comment, profile }) => ({
  type: COMMENTS_FETCH_DELETE_COMMENT,
  payload: { note, comment, profile },
});

export {
  commentsFetchDidStart,
  commentsFetchDidSucceed,
  commentsFetchDidFail,
  commentsFetchAsync,
  commentsFetchAddComment,
  commentsFetchUpdateComment,
  commentsFetchDeleteComment,
  COMMENTS_FETCH_DID_START,
  COMMENTS_FETCH_DID_SUCCEED,
  COMMENTS_FETCH_DID_FAIL,
  COMMENTS_FETCH_ADD_COMMENT,
  COMMENTS_FETCH_UPDATE_COMMENT,
  COMMENTS_FETCH_DELETE_COMMENT,
};
