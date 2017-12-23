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
    this.props.notesFetchAsync({ userId: this.props.currentProfileUserId });
  }

  render() {
    // console.log("HomeScreen: render");

    const {
      currentProfileUserId,
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
            notesFetchAsync={notesFetchAsync}
            userId={currentProfileUserId}
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
      timestampFormatted: PropTypes.string.isRequired,
      messageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  notesFetchAsync: PropTypes.func.isRequired,
  currentProfileUserId: PropTypes.string.isRequired,
};

HomeScreen.defaultProps = {
  errorMessage: "",
  fetching: false,
};

export default HomeScreen;
