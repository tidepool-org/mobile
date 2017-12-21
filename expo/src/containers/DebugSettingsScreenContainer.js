import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import DebugSettingsScreen from "../screens/DebugSettingsScreen";
import { navigateGoBack } from "../actions/navigation";
import { apiEnvironmentSetAndSaveAsync } from "../actions/apiEnvironment";

const mapStateToProps = state => ({
  selectedApiEnvironment: state.apiEnvironment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      apiEnvironmentSetAndSaveAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  DebugSettingsScreen
);
