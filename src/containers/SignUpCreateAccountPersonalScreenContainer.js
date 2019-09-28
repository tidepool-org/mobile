import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SignUpCreateAccountPersonalScreen from "../screens/SignUpCreateAccountPersonalScreen";
import { navigateSignUpTermsOfUse } from "../actions/navigation";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ navigateSignUpTermsOfUse }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpCreateAccountPersonalScreen);
