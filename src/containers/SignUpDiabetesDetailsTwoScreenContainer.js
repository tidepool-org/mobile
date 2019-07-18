import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpActivateAccount } from "../actions/navigation";
import SignUpDiabetesDetailsTwoScreen from "../screens/SignUpDiabetesDetailsTwoScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignUpActivateAccount }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpDiabetesDetailsTwoScreen);
