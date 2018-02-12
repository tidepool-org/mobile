import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  BackHandler,
  Keyboard,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";
import { Header } from "react-navigation";
import setSeconds from "date-fns/set_seconds";
import setMilliseconds from "date-fns/set_milliseconds";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import NotesListItem from "../components/NotesListItem";
import ModalScreenHeaderTitle from "../components/ModalScreenHeaderTitle";
import ModalScreenHeaderRight from "../components/ModalScreenHeaderRight";
import ModalScreenHeaderLeft from "../components/ModalScreenHeaderLeft";
import HashtagText from "../components/HashtagText";
import { NotePropType } from "../prop-types/note";
import { CommentPropType } from "../prop-types/comment";
import { ProfilePropType } from "../prop-types/profile";
import { UserPropType } from "../prop-types/user";

// TODO: edit comment - need to have Edit Comment make the text input be the comment you are editing!

// TODO: navigation - should we use a non-modal stack navigator for comments?

// FIXME: Android doesn't auto-scroll as text for the TextInput goes beyond the fixed height. This is apparently fixed in 0.52, which we're not on yet. See: https://github.com/facebook/react-native/issues/12799. Confirmed this is fixed in 0.52. The ejected app will move to 0.52, but expo is still behind. Once that catches up we can remove this FIXME since it will be fixed in both ejected and expo.

class EditCommentScreen extends PureComponent {
  static navigationOptions = () => ({
    gesturesEnabled: false, // Disable the pull down gesture for dismissing the modal screen
  });

  static renderSeparator() {
    return (
      <glamorous.View
        marginTop={7}
        marginBottom={7}
        height={StyleSheet.hairlineWidth}
        backgroundColor="#CED0CE"
      />
    );
  }

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;

    const { comment } = props;
    const timestamp = comment ? comment.timestamp : new Date();
    const messageText = comment ? comment.messageText : "";
    this.state = {
      isDirty: false,
      timestamp,
      messageText,
      isKeyboardVisible: false,
      containerViewY: null,
      keyboardY: null,
      screenContainerViewHeight: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );

    if (this.textInput) {
      this.focusTimer = setTimeout(() => {
        this.textInput.focus();
      }, 450);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
    }

    if (this.textInput) {
      Keyboard.dismiss();
    }
  }

  onBackPress = () => {
    if (this.state.isDirty) {
      this.onCloseAction();
      return true;
    }

    return false;
  };

  onChangeText = messageText => {
    this.setState(prevState => ({
      messageText,
      isDirty: this.getDirtyState({ ...prevState, messageText }),
    }));
  };

  onDateChangeIOS = timestamp => {
    this.setState(prevState => ({
      timestamp,
      isDirty: this.getDirtyState({ ...prevState, timestamp }),
    }));
  };

  onCloseAction = () => {
    if (this.state.isDirty) {
      this.showSaveChangesAlert();
    } else {
      this.discardAndGoBack();
    }
  };

  onContainerViewLayout = event => {
    const { y } = event.nativeEvent.layout;
    if (!this.state.isKeyboardVisible) {
      this.setState({
        containerViewY: y,
      });
    }
  };

  onScreenContainerViewLayout = event => {
    const { height } = event.nativeEvent.layout;
    this.setState({
      screenContainerViewHeight: height,
    });
  };

  onNoteScrollViewLayout = () => {
    this.scrollView.scrollToEnd({ animated: false });
  };

  onNoteScrollViewContentSizeChange = () => {
    this.scrollView.scrollToEnd({ animated: false });
  };

  getDirtyState(newState) {
    let isDirty;

    const { comment } = this.props;

    // Get isDirty state for time
    const newCommentTime = setMilliseconds(
      setSeconds(newState.timestamp, 0),
      0
    ).getTime();
    const commentTime = comment
      ? setMilliseconds(setSeconds(comment.timestamp, 0), 0).getTime()
      : 0;
    isDirty = newCommentTime !== commentTime;

    // Get isDirty state for messageText
    if (!isDirty) {
      if (comment) {
        isDirty = newState.messageText !== comment.messageText;
      } else {
        isDirty = !!newState.messageText;
      }
    }

    return isDirty;
  }

  discardAndGoBack = () => {
    this.props.navigateGoBack();
    this.textInput.blur();
  };

  saveAndGoBack = () => {
    const { currentUser, currentProfile, comment } = this.props;

    const editedComment = {
      ...comment,
      messageText: this.state.messageText,
      timestamp: this.state.timestamp,
    };
    this.props.commentUpdateAsync({
      currentUser,
      currentProfile,
      comment: editedComment,
    });
    this.props.navigateGoBack();
    this.textInput.blur();
  };

  showSaveChangesAlert = () => {
    Alert.alert(
      "Save Changes?",
      "You have made changes to this comment. Would you like to save these changes?",
      [
        {
          text: "Discard",
          onPress: this.discardAndGoBack,
        },
        {
          text: "Save",
          onPress: this.saveAndGoBack,
        },
      ]
    );
  };

  showDiscardCommentAlert = () => {
    Alert.alert(
      "Discard Comment?",
      "If you close this comment, your comment will be lost.",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: this.discardAndGoBack,
        },
      ]
    );
  };

  keyboardDidShow = event => {
    this.setState({
      isKeyboardVisible: true,
      keyboardY: event.endCoordinates.screenY,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      isKeyboardVisible: false,
    });
  };

  renderHeader() {
    const title = "Edit Comment";

    return (
      <Header
        scenes={[
          {
            index: 0,
            key: "modal",
            isActive: true,
          },
        ]}
        scene={{
          index: 0,
          key: "modal",
          isActive: true,
        }}
        navigation={{ state: { index: 0 } }}
        getScreenDetails={() => ({
          options: {
            headerStyle: { backgroundColor: Colors.darkPurple },
            headerTitle: (
              <ThemeProvider theme={this.theme}>
                <ModalScreenHeaderTitle title={title} />
              </ThemeProvider>
            ),
            headerLeft: <ModalScreenHeaderLeft action={this.onCloseAction} />,
            headerRight: (
              <ThemeProvider theme={this.theme}>
                <ModalScreenHeaderRight
                  actionTitle="Save"
                  action={this.saveAndGoBack}
                  disabled={!this.state.isDirty}
                />
              </ThemeProvider>
            ),
          },
        })}
      />
    );
  }

  // TODO: my - edit comment - we need to have the comment in the note list be editabale!?
  renderNote() {
    const { note, currentUser, currentProfile, commentsFetchData } = this.props;

    return (
      <NotesListItem
        note={note}
        currentUser={currentUser}
        currentProfile={currentProfile}
        commentsFetchData={commentsFetchData}
        commentsFetchAsync={() => {}}
        navigateEditNote={() => {}}
        navigateAddComment={() => {}}
        navigateEditComment={() => {}}
        initiallyExpanded
        allowExpansionToggle={false}
        allowEditing={false}
        includeSeparator={false}
      />
    );
  }

  renderComment() {
    // FIXME: Need to revisit this. If flex is not null here all the time for Android then we have weird layout.
    let flex = 1;
    if (Platform.OS === "ios" && this.state.isKeyboardVisible) {
      flex = null;
    } else if (Platform.OS === "android") {
      flex = null;
    }

    return (
      <glamorous.TextInput
        innerRef={textInput => {
          this.textInput = textInput;
        }}
        flex={flex}
        style={this.theme.commentsListItemTextStyle}
        paddingTop={7}
        paddingLeft={12}
        paddingRight={12}
        paddingBottom={7}
        allowFontScaling={false}
        multiline
        autoGrow={false}
        selectionColor="#657ef6"
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
        autoCorrect
        keyboardAppearance="dark"
        keyboardType="default"
        returnKeyType="default"
        onChangeText={this.onChangeText}
        onContentSizeChange={undefined}
      >
        <HashtagText
          boldStyle={this.theme.notesListItemHashtagStyle}
          normalStyle={this.theme.notesListItemTextStyle}
          text={this.state.messageText}
        />
      </glamorous.TextInput>
    );
  }

  render() {
    const containerViewHeight = this.state.isKeyboardVisible
      ? this.state.keyboardY - this.state.containerViewY
      : null;
    const noteViewHeight = this.state.screenContainerViewHeight
      ? this.state.screenContainerViewHeight * 0.3
      : null;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          backgroundColor="white"
          onLayout={this.onScreenContainerViewLayout}
        >
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          <glamorous.View
            flex={this.state.isKeyboardVisible ? null : 1}
            onLayout={this.onContainerViewLayout}
            height={containerViewHeight}
          >
            <glamorous.View height={noteViewHeight} marginBottom={7}>
              <glamorous.ScrollView
                innerRef={scrollView => {
                  this.scrollView = scrollView;
                }}
                onLayout={this.onNoteScrollViewLayout}
                onContentSizeChange={this.onNoteScrollViewContentSizeChange}
                keyboardShouldPersistTaps="always"
              >
                {this.renderNote()}
              </glamorous.ScrollView>
            </glamorous.View>
            {EditCommentScreen.renderSeparator()}
            <glamorous.View flex={1}>{this.renderComment()}</glamorous.View>
          </glamorous.View>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

EditCommentScreen.propTypes = {
  currentUser: UserPropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: NotePropType.isRequired,
  comment: CommentPropType,
  navigateGoBack: PropTypes.func.isRequired,
  commentUpdateAsync: PropTypes.func.isRequired,
  commentsFetchData: PropTypes.shape({
    comments: PropTypes.arrayOf(CommentPropType),
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
};

EditCommentScreen.defaultProps = {
  commentsFetchData: {
    comments: [],
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
  comment: null,
};

export default EditCommentScreen;
