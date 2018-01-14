import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { navigateAddNote, navigateGoBack } from "../actions/navigation";
import { noteUpdateAsync } from "../actions/noteUpdate";
import { noteAddAsync } from "../actions/noteAdd";

import AddOrEditNoteScreen from "../screens/AddOrEditNoteScreen";

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth,
  currentProfile: state.profile.currentProfile,
  note: ownProps.navigation.state.params.note,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateAddNote,
      navigateGoBack,
      noteUpdateAsync,
      noteAddAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  AddOrEditNoteScreen
);
