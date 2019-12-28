import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import HomeScreen from "../screens/HomeScreen";
import {
  notesFetchAsync,
  notesFetchSetSearchFilter,
} from "../actions/notesFetch";
import { commentsFetchAsync } from "../actions/commentsFetch";
import { noteDeleteAsync } from "../actions/noteDelete";
import { commentDeleteAsync } from "../actions/commentDelete";
import { graphDataFetchAsync } from "../actions/graphDataFetch";
import {
  navigateAddComment,
  navigateDrawerClose,
  navigateEditComment,
  navigateEditNote,
  navigateHealthSync,
} from "../actions/navigation";
import { firstTimeTipsShowTip } from "../actions/firstTimeTips";

const mapStateToProps = state => ({
  isOffline: state.offline.isOffline,
  navigation: state.navigation,
  notesFetch: state.notesFetch,
  currentUser: state.auth,
  notes: state.notesFetch.notes,
  searchText: state.notesFetch.searchText,
  commentsFetchDataByMessageId: state.commentsFetch,
  graphDataFetchDataByMessageId: state.graphDataFetch,
  errorMessage: state.notesFetch.errorMessage,
  fetching: state.notesFetch.fetching,
  currentProfile: state.currentProfile,
  graphRenderer: state.graphRenderer,
  firstTimeTips: state.firstTimeTips,
  health: state.health,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notesFetchAsync,
      notesFetchSetSearchFilter,
      noteDeleteAsync,
      commentsFetchAsync,
      commentDeleteAsync,
      graphDataFetchAsync,
      navigateDrawerClose,
      navigateEditNote,
      navigateAddComment,
      navigateEditComment,
      navigateHealthSync,
      firstTimeTipsShowTip,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
