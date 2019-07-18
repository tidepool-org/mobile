import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SignUpScreen from "../screens/SignUpScreen";
import {
  navigateSignUpCreateAccount,
  navigateSignUpCreateAccountClinician,
  navigateSignUpCreateAccountPersonal,
} from "../actions/navigation";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateSignUpCreateAccount,
      navigateSignUpCreateAccountClinician,
      navigateSignUpCreateAccountPersonal, 
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
