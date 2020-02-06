import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HealthSyncScreen from "../screens/HealthSyncScreen";
import { navigateGoBack } from "../actions/navigation";
import { healthStateSet } from "../actions/health";
import getRouteName from "../navigators/getRouteName";

const mapStateToProps = state => {
  const { params } = getRouteName({ navigation: state.navigation });
  const isInitialSync = params ? params.isInitialSync : false;
  return {
    currentUser: state.auth,
    health: state.health,
    isOffline: state.offline.isOffline,
    isInitialSync,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      healthStateSet,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HealthSyncScreen);
