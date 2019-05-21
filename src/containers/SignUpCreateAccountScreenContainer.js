import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpTermsOfUse } from "../actions/navigation";
import SignUpCreateAccountScreen from "../screens/SignUpCreateAccountScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ navigateSignUpTermsOfUse }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpCreateAccountScreen);
