import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreenHeaderLeft from "../components/HomeScreenHeaderLeft";
import { navigateDrawerOpen } from "../actions/navigation";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateDrawerOpen,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(HomeScreenHeaderLeft);
