import api from "../api";
import { commentsFetchDeleteComment } from "../actions/commentsFetch";

export const COMMENT_DELETE_DID_START = "COMMENT_DELETE_DID_START";
export const COMMENT_DELETE_DID_SUCCEED = "COMMENT_DELETE_DID_SUCCEED";
export const COMMENT_DELETE_DID_FAIL = "COMMENT_DELETE_DID_FAIL";

export const commentDeleteDidStart = ({ comment }) => ({
  type: COMMENT_DELETE_DID_START,
  payload: { comment },
});

export const commentDeleteDidSucceed = ({ comment }) => ({
  type: COMMENT_DELETE_DID_SUCCEED,
  payload: { comment },
});

// TODO: Need reducer for this to display error alert and test it with failure .. consider moving errorMessage handling higher up the component hierarchy, especially if we're always just rendering it as an alert
export const commentDeleteDidFail = ({ errorMessage }) => ({
  type: COMMENT_DELETE_DID_FAIL,
  payload: { errorMessage },
});

export const commentDeleteAsync = ({
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
