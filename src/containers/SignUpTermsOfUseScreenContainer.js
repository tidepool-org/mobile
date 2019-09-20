import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  navigateSignUpDiabetesDetails,
  navigatePrivacyAndTerms,
} from "../actions/navigation";
import SignUpTermsOfUseScreen from "../screens/SignUpTermsOfUseScreen";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { navigateSignUpDiabetesDetails, navigatePrivacyAndTerms },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpTermsOfUseScreen);
