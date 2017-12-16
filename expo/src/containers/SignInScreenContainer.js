import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SignInScreen from "../screens/SignInScreen";
import { navigateSignUp } from "../actions/navigation";

const mapDispatchToProps = dispatch => bindActionCreators(
    {
      navigateSignUp,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SignInScreen);
