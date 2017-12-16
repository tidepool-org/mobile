import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SignInForm from "../components/SignInForm";
import { navigateForgotPassword } from "../actions/navigation";
import { authSignInReset, authSignInAsync } from "../actions/auth";

const mapStateToProps = state => ({
  signingIn: state.auth.signingIn,
  errorMessage: state.auth.errorMessage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authSignInReset,
      authSignInAsync,
      navigateForgotPassword,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
