import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HeaderLeft from "../components/HeaderLeft";
import { navigateDrawerOpen } from "../actions/navigation";

const mapDispatchToProps = dispatch => bindActionCreators(
    {
      navigateDrawerOpen,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(HeaderLeft);
