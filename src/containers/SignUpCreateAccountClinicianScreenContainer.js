import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpClinicianSetup } from "../actions/navigation";
import SignUpCreateAccountClinicianScreen from "../screens/SignUpCreateAccountClinicianScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ navigateSignUpClinicianSetup }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpCreateAccountClinicianScreen);
