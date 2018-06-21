import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreenHeaderRight from "../components/HomeScreenHeaderRight";
import { navigateAddNote } from "../actions/navigation";
import { firstTimeTipsShowTip } from "../actions/firstTimeTips";

const mapStateToProps = state => ({
  navigation: state.navigation,
  notesFetch: state.notesFetch,
  currentUser: state.auth,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateAddNote,
      firstTimeTipsShowTip,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenHeaderRight);
