import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SignUpActivateAccountScreen from "../screens/SignUpActivateAccountScreen";
import { navigateSignIn } from "../actions/navigation";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignIn }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpActivateAccountScreen);
