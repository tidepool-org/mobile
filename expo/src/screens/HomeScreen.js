import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HeaderTitleContainer from "../containers/HeaderTitleContainer";
import HeaderLeftContainer from "../containers/HeaderLeftContainer";
import HeaderRight from "../components/HeaderRight";
import NotesList from "../components/NotesList";
import { ProfilePropType } from "../prop-types/profile";
import { CommentPropType } from "../prop-types/comment";

// TODO: notes - we need to handle empty notes list with the "add note" tip

class HomeScreen extends PureComponent {
  static navigationOptions = () => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTitle: <HeaderTitleContainer />,
      headerLeft: <HeaderLeftContainer />,
      headerRight: <HeaderRight />,
    };
  };

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  componentDidMount() {
    this.props.notesFetchAsync({
      profile: this.props.currentProfile,
    });
  }

  render() {
    // console.log("HomeScreen: render");

    const {
      commentsFetchDataByMessageId,
      commentsFetchAsync,
      currentProfile,
      errorMessage,
      fetching,
      notes,
      notesFetchAsync,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <NotesList
            notes={notes}
            fetching={fetching}
            errorMessage={errorMessage}
            profile={currentProfile}
            notesFetchAsync={notesFetchAsync}
            commentsFetchAsync={commentsFetchAsync}
            commentsFetchDataByMessageId={commentsFetchDataByMessageId}
          />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

HomeScreen.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date),
      messageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  currentProfile: ProfilePropType.isRequired,
  notesFetchAsync: PropTypes.func.isRequired,
  commentsFetchAsync: PropTypes.func.isRequired,
  commentsFetchDataByMessageId: PropTypes.objectOf(
    PropTypes.shape({
      errorMessage: PropTypes.string,
      fetching: PropTypes.bool,
      comments: PropTypes.arrayOf(CommentPropType),
    })
  ),
};

HomeScreen.defaultProps = {
  errorMessage: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
};

export default HomeScreen;
