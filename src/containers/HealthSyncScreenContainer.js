import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HealthSyncScreen from "../screens/HealthSyncScreen";
import { navigateGoBack } from "../actions/navigation";
import { healthKitInterfaceSet } from "../actions/health";
import getRouteName from "../navigators/getRouteName";

const mapStateToProps = state => {
  const { params } = getRouteName({ navigation: state.navigation });
  const isInitialSync = params ? params.isInitialSync : false;
  return {
    currentUser: state.auth,
    health: state.health,
    isInitialSync,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateGoBack,
      healthKitInterfaceSet,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HealthSyncScreen);
