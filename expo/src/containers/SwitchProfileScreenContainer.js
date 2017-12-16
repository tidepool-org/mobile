import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SwitchProfileScreen from "../screens/SwitchProfileScreen";
import { navigateGoBack } from "../actions/navigation";

const mapDispatchToProps = dispatch => bindActionCreators(
    {
      navigateGoBack,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SwitchProfileScreen);
