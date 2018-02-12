import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { navigateGoBack } from "../actions/navigation";
import { commentAddAsync } from "../actions/commentAdd";

import AddCommentScreen from "../screens/AddCommentScreen";

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth,
  currentProfile: state.profile.currentProfile,
  note: ownProps.navigation.state.params.note,
  comment: ownProps.navigation.state.params.comment,
  commentsFetchData: ownProps.navigation.state.params.commentsFetchData,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      commentAddAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddCommentScreen);
