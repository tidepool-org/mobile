import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignIn } from "../actions/navigation";
import SignUpActivateAccountScreen from "../screens/SignUpActivateAccountScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignIn }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpActivateAccountScreen);
