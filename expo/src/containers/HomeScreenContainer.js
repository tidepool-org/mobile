import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreen from "../screens/HomeScreen";
import { notesFetchAsync } from "../actions/notesFetch";
import { commentsFetchAsync } from "../actions/commentsFetch";
import { navigateEditNote } from "../actions/navigation";

const mapStateToProps = state => ({
  currentUser: state.auth,
  notes: state.notesFetch.notes,
  commentsFetchDataByMessageId: state.commentsFetch,
  errorMessage: state.notesFetch.errorMessage,
  fetching: state.notesFetch.fetching,
  currentProfile: state.profile.currentProfile,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notesFetchAsync,
      commentsFetchAsync,
      navigateEditNote,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
