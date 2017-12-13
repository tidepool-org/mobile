import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HeaderLeft from "../components/HeaderLeft";
import { navigateDrawerOpen } from "../actions/navigation";

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      navigateDrawerOpen,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(HeaderLeft);
