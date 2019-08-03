import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import DebugSettingsScreen from "../screens/DebugSettingsScreen";
import { navigateGoBack } from "../actions/navigation";
import { apiEnvironmentSetAndSaveAsync } from "../actions/apiEnvironment";
import { apiCacheExpirationSetAndSaveAsync } from "../actions/apiCacheExpiration";
import { graphRendererSetAndSaveAsync } from "../actions/graphRenderer";
import { firstTimeTipsResetTips } from "../actions/firstTimeTips";
import { logLevelSetAndSaveAsync } from "../actions/logLevel";

const mapStateToProps = state => ({
  selectedApiEnvironment: state.apiEnvironment,
  selectedApiCacheExpiration: state.apiCacheExpiration,
  selectedGraphRenderer: state.graphRenderer,
  selectedLogLevel: state.logLevel,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      apiEnvironmentSetAndSaveAsync,
      apiCacheExpirationSetAndSaveAsync,
      firstTimeTipsResetTips,
      graphRendererSetAndSaveAsync,
      logLevelSetAndSaveAsync,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebugSettingsScreen);
