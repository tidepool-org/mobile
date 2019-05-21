import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpActivateAccount } from "../actions/navigation";
import SignUpDiabetesDetailsScreen from "../screens/SignUpDiabetesDetailsScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignUpActivateAccount }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpDiabetesDetailsScreen);
