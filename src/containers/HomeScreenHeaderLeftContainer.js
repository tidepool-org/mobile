import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreenHeaderLeft from "../components/HomeScreenHeaderLeft";
import { navigateDrawerOpen } from "../actions/navigation";
import { firstTimeTipsShowTip } from "../actions/firstTimeTips";

const mapStateToProps = state => ({
  navigation: state.navigation,
  notesFetch: state.notesFetch,
  currentUser: state.auth,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateDrawerOpen,
      firstTimeTipsShowTip,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenHeaderLeft);
