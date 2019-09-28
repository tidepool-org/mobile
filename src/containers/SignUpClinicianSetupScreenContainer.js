import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpActivateAccount } from "../actions/navigation";
import SignUpClinicianSetupScreen from "../screens/SignUpClinicianSetupScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ navigateSignUpActivateAccount }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpClinicianSetupScreen);
