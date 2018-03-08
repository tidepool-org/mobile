import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { navigateGoBack } from "../actions/navigation";
import { noteUpdateAsync } from "../actions/noteUpdate";
import { noteAddAsync } from "../actions/noteAdd";

import AddOrEditNoteScreen from "../screens/AddOrEditNoteScreen";

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth,
  currentProfile: state.profile.currentProfile,
  note: ownProps.navigation.state.params.note,
  hashtags: state.notesFetch.hashtags,
  timestampAddNote: new Date(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      noteUpdateAsync,
      noteAddAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  AddOrEditNoteScreen
);
