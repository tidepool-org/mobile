import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { navigateGoBack } from "../actions/navigation";
import { commentAddAsync } from "../actions/commentAdd";
import { commentUpdateAsync } from "../actions/commentUpdate";
import { commentsFetchAsync } from "../actions/commentsFetch";
import { graphDataFetchAsync } from "../actions/graphDataFetch";

import AddOrEditCommentScreen from "../screens/AddOrEditCommentScreen";

const mapStateToProps = (state, ownProps) => {
  const { note } = ownProps.navigation.state.params;
  const commentsFetchData = state.commentsFetch[note.id];
  const graphDataFetchData = state.graphDataFetch[note.id];

  return {
    currentUser: state.auth,
    currentProfile: state.currentProfile,
    note,
    comment: ownProps.navigation.state.params.comment,
    timestampAddComment: new Date(),
    commentsFetchData,
    graphDataFetchData,
    graphRenderer: state.graphRenderer,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      commentAddAsync,
      commentUpdateAsync,
      commentsFetchAsync,
      graphDataFetchAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  AddOrEditCommentScreen
);
