import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, Keyboard, StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import AddOrEditCommentScreenNote from "../components/AddOrEditCommentScreenNote";
import AddOrEditCommentScreenCommentsList from "../components/AddOrEditCommentScreenCommentsList";
import { NotePropType } from "../prop-types/note";
import { CommentPropType } from "../prop-types/comment";
import { ProfilePropType } from "../prop-types/profile";
import { UserPropType } from "../prop-types/user";

// TODO: comments - Add "draft" edit/post comment object to commentsFetchData to avoid data loss when navigating away? (Similar to Facebook's UX for Adding/Editing comments)

// FIXME: polish - When we navigate away via stack navigator, we don't dismiss keyboard right away. We need to update to latest React Navigation to get Navigation Event Subscriptions to hook into the route change so we can dismiss the keyboard right away. See: https://github.com/react-navigation/react-navigation/pull/3345

class AddOrEditCommentScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = { backgroundColor: Colors.darkPurple };
    const title = navigation.state.params.comment
      ? "Edit Comment"
      : "Add Comment";

    return {
      drawerLockMode: "locked-closed",
      headerStyle,
      headerTintColor: "white",
      headerTitle: (
        <glamorous.Text
          style={PrimaryTheme.screenHeaderTitleStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
          {title}
        </glamorous.Text>
      ),
      headerRight: (
        <glamorous.View
          style={{
            padding: 10,
            marginRight: 6,
          }}
        />
      ),
    };
  };

  static showErrorMessageAlert() {
    // TODO: strings - Use some i18n module for these and other UI strings
    Alert.alert(
      "Unknown Error Occurred",
      "An unknown error occurred. We are working hard to resolve this issue.",
      [{ text: "OK" }]
    );
  }

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;

    this.state = {
      isKeyboardVisible: false,
      containerViewHeightWithoutKeyboard: null,
      keyboardHeight: null,
    };

    this.editableCommentY = null;
    this.editableCommentHeight = null;
    this.scrollViewContentHeight = null;
    this.containerViewHeight = null;
    this.onScrollViewContentSizeChange = this.onScrollViewContentSizeChange.bind(
      this
    ); // FIXME: This bind shouldn't be necessary, since we're already using a class field
  }

  componentDidMount() {
    if (this.props.commentsFetchData.errorMessage) {
      AddOrEditCommentScreen.showErrorMessageAlert();
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.commentsFetchData.errorMessage &&
      !this.props.commentsFetchData.errorMessage
    ) {
      AddOrEditCommentScreen.showErrorMessageAlert();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onScrollViewContentSizeChange = (contentWidth, contentHeight) => {
    this.scrollViewContentHeight = contentHeight;
    this.scrollToEditableComment();
  };

  onEditableCommentLayout = event => {
    const { layout } = event.nativeEvent;
    this.editableCommentY = layout.y;
    this.editableCommentHeight = layout.height;
    this.scrollToEditableComment();
  };

  onContainerViewLayout = event => {
    const { height } = event.nativeEvent.layout;
    if (!this.state.isKeyboardVisible) {
      this.setState({
        containerViewHeightWithoutKeyboard: height,
      });
    }
    this.containerViewHeight = height;
    this.scrollToEditableComment();
  };

  scrollToEditableComment() {
    const isScrollable =
      this.editableCommentHeight &&
      this.scrollViewContentHeight &&
      this.containerViewHeight &&
      this.scrollViewContentHeight > this.containerViewHeight;
    if (isScrollable) {
      const scrollMax = this.scrollViewContentHeight - this.containerViewHeight;
      let scrollY =
        this.editableCommentY +
        this.editableCommentHeight -
        this.containerViewHeight / 4;
      if (scrollY < 0) {
        scrollY = 0;
      } else if (scrollY > scrollMax) {
        scrollY = scrollMax;
      }
      this.scrollView.scrollTo({
        x: 0,
        y: scrollY,
        animated: this.state.isKeyboardVisible,
      });
    }
  }

  keyboardDidShow = event => {
    this.setState({
      isKeyboardVisible: true,
      keyboardHeight: event.endCoordinates.height,
    });
    this.scrollToEditableComment();
  };

  keyboardDidHide = () => {
    this.setState({
      isKeyboardVisible: false,
    });
  };

  goBack() {
    this.props.navigateGoBack();
    Keyboard.dismiss();
  }

  cancelAndGoBack = () => {
    this.goBack();
  };

  addOrSaveAndGoBack = ({ messageText }) => {
    const { currentUser, currentProfile, comment, note } = this.props;

    if (comment) {
      this.props.commentUpdateAsync({
        currentUser,
        currentProfile,
        note,
        comment: { ...comment, messageText },
      });
    } else {
      this.props.commentAddAsync({
        currentUser,
        currentProfile,
        note,
        messageText,
      });
    }
    this.goBack();
  };

  renderNote() {
    const {
      comment,
      note,
      currentUser,
      currentProfile,
      commentsFetchData,
    } = this.props;

    return (
      <AddOrEditCommentScreenNote
        note={note}
        comment={comment}
        currentUser={currentUser}
        currentProfile={currentProfile}
        commentsFetchData={commentsFetchData}
      />
    );
  }

  renderComments() {
    const { comment, note, currentUser, commentsFetchData } = this.props;

    return (
      <AddOrEditCommentScreenCommentsList
        currentUser={currentUser}
        note={note}
        comment={comment}
        commentsFetchData={commentsFetchData}
        onEditableCommentLayout={this.onEditableCommentLayout}
        onPressSave={this.addOrSaveAndGoBack}
        onPressCancel={this.cancelAndGoBack}
      />
    );
  }

  render() {
    const containerViewHeight = this.state.isKeyboardVisible
      ? this.state.containerViewHeightWithoutKeyboard -
        this.state.keyboardHeight
      : null;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1} backgroundColor="white">
          <StatusBar barStyle="light-content" />
          <glamorous.View
            onLayout={this.onContainerViewLayout}
            height={this.state.isKeyboardVisible ? containerViewHeight : null}
            flex={this.state.isKeyboardVisible ? null : 1}
          >
            <glamorous.ScrollView
              innerRef={scrollView => {
                this.scrollView = scrollView;
              }}
              keyboardShouldPersistTaps="always"
              onContentSizeChange={this.onScrollViewContentSizeChange}
            >
              {this.renderNote()}
              {this.renderComments()}
            </glamorous.ScrollView>
          </glamorous.View>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

AddOrEditCommentScreen.propTypes = {
  currentUser: UserPropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: NotePropType.isRequired,
  comment: CommentPropType,
  navigateGoBack: PropTypes.func.isRequired,
  commentAddAsync: PropTypes.func.isRequired,
  commentUpdateAsync: PropTypes.func.isRequired,
  commentsFetchData: PropTypes.shape({
    comments: PropTypes.arrayOf(CommentPropType),
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
};

AddOrEditCommentScreen.defaultProps = {
  commentsFetchData: {
    comments: [],
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
  comment: null,
};

export default AddOrEditCommentScreen;
