import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SwitchProfileScreen from "../screens/SwitchProfileScreen";
import { navigateGoBack } from "../actions/navigation";
import { notesFetchAsync } from "../actions/notesFetch";
import { profilesFetchAsync } from "../actions/profilesFetch";
import { profileSet } from "../actions/profile";

const mapStateToProps = state => {
  let profileListData = [];

  if (!state.profilesFetch.errorMessage) {
    profileListData = state.profilesFetch.profiles.map(profile => ({
      ...profile,
      currentUserId: state.auth.userId,
      selectedProfileUserId: state.profile.currentProfile.userId,
    }));
  }

  return {
    profileListData,
    errorMessage: state.profilesFetch.errorMessage,
    fetching: state.profilesFetch.fetching,
    selectedProfileUserId: state.profile.currentProfile.userId,
    currentUser: state.auth,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      profilesFetchAsync,
      notesFetchAsync,
      profileSet,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  SwitchProfileScreen
);
