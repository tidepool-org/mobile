import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import DebugSettingsScreen from "../screens/DebugSettingsScreen";
import { navigateGoBack } from "../actions/navigation";
import { apiEnvironmentSetAndSaveAsync } from "../actions/apiEnvironment";
import { graphRendererSetAndSaveAsync } from "../actions/graphRenderer";

const mapStateToProps = state => ({
  selectedApiEnvironment: state.apiEnvironment,
  selectedGraphRenderer: state.graphRenderer,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      apiEnvironmentSetAndSaveAsync,
      graphRendererSetAndSaveAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  DebugSettingsScreen
);
