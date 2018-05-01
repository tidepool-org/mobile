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
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
} from "../actions/navigation";

const mapStateToProps = state => ({
  currentUser: state.auth,
  notes: state.notesFetch.notes,
  searchText: state.notesFetch.searchText,
  commentsFetchDataByMessageId: state.commentsFetch,
  graphDataFetchDataByMessageId: state.graphDataFetch,
  errorMessage: state.notesFetch.errorMessage,
  fetching: state.notesFetch.fetching,
  currentProfile: state.currentProfile,
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
      navigateEditNote,
      navigateAddComment,
      navigateEditComment,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
