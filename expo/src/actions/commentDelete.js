import api from "../api";
import { commentsFetchDeleteComment } from "../actions/commentsFetch";

const COMMENT_DELETE_DID_START = "COMMENT_DELETE_DID_START";
const COMMENT_DELETE_DID_SUCCEED = "COMMENT_DELETE_DID_SUCCEED";
const COMMENT_DELETE_DID_FAIL = "COMMENT_DELETE_DID_FAIL";

const commentDeleteDidStart = ({ comment }) => ({
  type: COMMENT_DELETE_DID_START,
  payload: { comment },
});

const commentDeleteDidSucceed = ({ comment }) => ({
  type: COMMENT_DELETE_DID_SUCCEED,
  payload: { comment },
});

// TODO: Need reducer for this to display error alert and test it with failure .. consider moving errorMessage handling higher up the component hierarchy, especially if we're always just rendering it as an alert
const commentDeleteDidFail = ({ errorMessage }) => ({
  type: COMMENT_DELETE_DID_FAIL,
  payload: { errorMessage },
});

const commentDeleteAsync = ({
  note,
  currentProfile,
  comment,
}) => async dispatch => {
  dispatch(commentDeleteDidStart({ comment }));

  const { errorMessage } = await api().deleteCommentAsync({
    comment,
  });

  if (errorMessage) {
    dispatch(commentDeleteDidFail({ errorMessage }));
  } else {
    dispatch(commentDeleteDidSucceed({ comment }));
    dispatch(
      commentsFetchDeleteComment({ note, profile: currentProfile, comment })
    );
  }
};

export {
  commentDeleteDidStart,
  commentDeleteDidSucceed,
  commentDeleteDidFail,
  commentDeleteAsync,
  COMMENT_DELETE_DID_START,
  COMMENT_DELETE_DID_SUCCEED,
  COMMENT_DELETE_DID_FAIL,
};
