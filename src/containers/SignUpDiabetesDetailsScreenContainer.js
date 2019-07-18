import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpActivateAccount, navigateSignUpDiabetesDetailsTwo } from "../actions/navigation";
import SignUpDiabetesDetailsScreen from "../screens/SignUpDiabetesDetailsScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignUpActivateAccount, navigateSignUpDiabetesDetailsTwo }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpDiabetesDetailsScreen);
