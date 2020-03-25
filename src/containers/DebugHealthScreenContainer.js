import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateDebugSettings, navigateGoBack } from "../actions/navigation";

import DebugHealthScreen from "../screens/DebugHealthScreen";

const mapStateToProps = state => ({
  currentUser: state.auth,
  health: state.health,
  errorMessage: "",
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateDebugSettings,
      navigateGoBack,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebugHealthScreen);
