import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigateSignUpActivateAccount } from "../actions/navigation";
import SignUpDonateData from "../screens/SignUpDonateData";

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ navigateSignUpActivateAccount }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpDonateData);
