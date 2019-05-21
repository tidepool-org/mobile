import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpCreateAccount } from "../actions/navigation";
import SignUpScreen from "../screens/SignUpScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ navigateSignUpCreateAccount }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
