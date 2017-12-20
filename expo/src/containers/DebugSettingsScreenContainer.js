import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import DebugSettingsScreen from "../screens/DebugSettingsScreen";
import { navigateGoBack } from "../actions/navigation";
import { environmentSignOutAndSetCurrentEnvironmentAsync } from "../actions/environment";

const mapStateToProps = state => ({
  selectedEnvironment: state.environment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      environmentSignOutAndSetCurrentEnvironmentAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  DebugSettingsScreen
);
