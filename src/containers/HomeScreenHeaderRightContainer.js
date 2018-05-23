import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreenHeaderRight from "../components/HomeScreenHeaderRight";
import { navigateAddNote } from "../actions/navigation";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateAddNote,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(HomeScreenHeaderRight);
