import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  BackHandler,
  Keyboard,
  StatusBar,
  DatePickerIOS,
  DatePickerAndroid,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TimePickerAndroid,
} from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";
import { Header } from "react-navigation";
import setYear from "date-fns/set_year";
import setMonth from "date-fns/set_month";
import setDate from "date-fns/set_date";
import setSeconds from "date-fns/set_seconds";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import setMilliseconds from "date-fns/set_milliseconds";
import getHours from "date-fns/get_hours";
import getMinutes from "date-fns/get_minutes";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import ModalScreenHeaderTitle from "../components/ModalScreenHeaderTitle";
import ModalScreenHeaderRight from "../components/ModalScreenHeaderRight";
import ModalScreenHeaderLeft from "../components/ModalScreenHeaderLeft";
import HashtagText from "../components/HashtagText";
import { Metrics } from "../models/Metrics";
import { formatDateAndTimeForAddOrEditNote } from "../utils/formatDate";
import { ProfilePropType } from "../prop-types/profile";
import { UserPropType } from "../prop-types/user";
import HashtagPicker from "../components/HashtagPicker";
import { ConnectionStatus } from "../models/ConnectionStatus";
import AlertManager from "../models/AlertManager";

// TODO: refactor - Refactor this screen. It's too complex and responsible for too much, it seems
// TODO: refactor - Factor out some of the modal screen support
// TODO: refactor - Consider also using react navigation modal, and the factored out modal screen support, for Debug Settings

// TODO: polish - animation - The animation between "Edit" and "Done" for iOS doesn't look great (compare with iOS Tidepool Mobile spp)
// TODO: polish - android - Style the date and time pickers with better theme colors?

// FIXME: Now that we moved back to adjustResize (from adjustPan), the Add Note is clipped a bit for Android when input gets to bottom. Look at fixing Add Note to work more like Add/Edit Comment re: keyboard handling, etc
// FIXME: Currently we're handling keyboard hide/show events to ajust size of the TextInput. Ideally should be able to simplify with KeyboardAvoidingView, but, see: https://github.com/facebook/react-native/issues/16826
// FIXME: We're importing Header directly and rendering in this modal, rather than getting that for free as part of navigator. This is needed due to bugs in React Navigation related to double headers with nested navigators. We have to set headerMode to 'none' for the modal stack navigator (like the one presenting this screen), which prevents the double header on the parent navigator, but, also removes it from the nested one.

const ADD_OR_EDIT_SCREEN_ADD_NOTE_TITLE = "Add Note";
const ADD_OR_EDIT_SCREEN_EDIT_NOTE_TITLE = "Edit Note";

class AddOrEditNoteScreen extends PureComponent {
  static navigationOptions = () => ({
    gesturesEnabled: false, // Disable the pull down gesture for dismissing the modal screen
  });

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
    this.okToSendOnChangeTextMetric = true;

    const { note, timestampAddNote } = props;
    const timestamp = note ? note.timestamp : timestampAddNote;
    const messageText = note ? note.messageText : "";
    this.state = {
      isDirty: false,
      isEditingTimestamp: false,
      timestamp,
      messageText,
      isKeyboardVisible: false,
      containerViewY: null,
      keyboardY: null,
      selection: { start: messageText.length, end: messageText.length },
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

  onSelectionChange = event => {
    const { selection } = event.nativeEvent;
    this.setState({ selection });
  };

  onPressHashtag = hashtag => {
    const { selection, messageText } = this.state;
    const messageTextBeforeAddingHashtag = messageText;

    const firstPartBeforeHashtag = messageTextBeforeAddingHashtag.substr(
      0,
      selection.start
    );
    let leftSpaceBeforeHashtag = "";
    if (firstPartBeforeHashtag.length > 0) {
      if (
        firstPartBeforeHashtag.charAt(firstPartBeforeHashtag.length - 1).trim()
          .length > 0
      ) {
        leftSpaceBeforeHashtag = " ";
      }
    }

    const secondPartAfterHashtag = messageTextBeforeAddingHashtag.substring(
      selection.end
    );
    let rightSpaceAfterHashtag = "";
    if (secondPartAfterHashtag.length > 0) {
      if (secondPartAfterHashtag.charAt(0).trim().length > 0) {
        rightSpaceAfterHashtag = " ";
      }
    } else {
      rightSpaceAfterHashtag = " ";
    }
    const newMessageText = `${firstPartBeforeHashtag}${leftSpaceBeforeHashtag}${hashtag}${rightSpaceAfterHashtag}${secondPartAfterHashtag}`;
    this.setState(prevState => ({
      messageText: newMessageText,
      isDirty: this.getDirtyState({
        ...prevState,
        messageText: newMessageText,
      }),
    }));
    this.textInput.focus();
  };

  onBackPress = () => {
    const { isDirty } = this.state;

    if (isDirty) {
      this.onCloseAction();
      return true;
    }

    return false;
  };

  onChangeText = messageText => {
    if (this.okToSendOnChangeTextMetric) {
      this.okToSendOnChangeTextMetric = false;
      Metrics.track({ metric: "Clicked On Message Box" });
    }

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
    const { isDirty } = this.state;

    Metrics.track({ metric: "Close Add or Edit Note" });

    if (isDirty) {
      if (this.isAddNoteMode()) {
        this.showDiscardNoteAlert();
      } else {
        this.showSaveChangesAlert();
      }
    } else {
      this.discardAndGoBack();
    }
  };

  onContainerViewLayout = event => {
    const { y } = event.nativeEvent.layout;
    const { isKeyboardVisible } = this.state;

    if (!isKeyboardVisible) {
      this.setState({
        containerViewY: y,
      });
    }
  };

  getDirtyState(newState) {
    let isDirty;

    if (this.isAddNoteMode()) {
      // For Add Note we just care whether there is some text entered
      isDirty = newState.messageText.trim().length > 0;
    } else {
      const { note } = this.props;

      // Get isDirty state for time
      const newNoteTime = setMilliseconds(
        setSeconds(newState.timestamp, 0),
        0
      ).getTime();
      const noteTime = note
        ? setMilliseconds(setSeconds(note.timestamp, 0), 0).getTime()
        : 0;
      isDirty = newNoteTime !== noteTime;

      // Get isDirty state for messageText
      if (!isDirty) {
        if (note) {
          isDirty = newState.messageText !== note.messageText;
        } else {
          isDirty = !!newState.messageText;
        }
      }
    }

    return isDirty;
  }

  setIsEditingTimestamp = isEditingTimestampParam => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 175,
      useNativeDriver: true,
    });

    const { isEditingTimestamp } = this.state;
    if (isEditingTimestampParam && !isEditingTimestamp) {
      Metrics.track({ metric: "Clicked Change Date" });
      this.textInput.blur();
      if (this.dummyTextInputIOS) {
        this.dummyTextInputIOS.focus();
      }
    } else {
      this.textInput.focus();
    }

    this.setState({
      isEditingTimestamp: isEditingTimestampParam,
    });
  };

  toggleIsEditingTimestampIOS = () => {
    const { isEditingTimestamp } = this.state;
    this.setIsEditingTimestamp(!isEditingTimestamp);
  };

  startEditingTimestamp = () => {
    this.setIsEditingTimestamp(true);

    if (Platform.OS === "android") {
      this.openAndroidDatePicker();
    }
  };

  stopEditingTimestamp = () => {
    this.setIsEditingTimestamp(false);
  };

  discardAndGoBack = () => {
    const { navigateGoBack } = this.props;

    navigateGoBack();
    this.textInput.blur();
    if (this.dummyTextInputIOS) {
      this.dummyTextInputIOS.focus();
    }
  };

  saveAndGoBack = () => {
    const {
      currentUser,
      currentProfile,
      note,
      noteAddAsync,
      noteUpdateAsync,
      navigateGoBack,
    } = this.props;

    if (ConnectionStatus.isOffline) {
      AlertManager.showOfflineMessage(
        "It seems you’re offline, so your note can’t be saved."
      );
      return;
    }

    const { messageText, timestamp } = this.state;

    if (this.isEditNoteMode()) {
      const editedNote = {
        ...note,
        messageText: messageText.trim(),
        timestamp,
      };
      noteUpdateAsync({
        currentUser,
        currentProfile,
        note: editedNote,
        originalNote: note,
      });
      Metrics.track({ metric: "Clicked Save Note" });
    } else {
      noteAddAsync({
        currentUser,
        currentProfile,
        messageText: messageText.trim(),
        timestamp,
      });
      Metrics.track({ metric: "Clicked Post Note" });
    }
    navigateGoBack();
    this.textInput.blur();
    if (this.dummyTextInputIOS) {
      this.dummyTextInputIOS.focus();
    }
  };

  showSaveChangesAlert = () => {
    AlertManager.showDiscardOrSaveAlert({
      message:
        "You have made changes to this note. Would you like to save these changes?",
      onPressDiscard: this.discardAndGoBack,
      onPressSave: this.saveAndGoBack,
    });
  };

  showDiscardNoteAlert = () => {
    AlertManager.showCancelOrDestructiveAlert({
      title: AlertManager.alertTitleDiscard,
      message: "If you close this note, your note will be lost.",
      destructiveButtonText: AlertManager.alertButtonTextDiscard,
      onPress: this.discardAndGoBack,
    });
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

  openAndroidDatePicker = async () => {
    try {
      const { timestamp } = this.state;

      const { action, year, month, day } = await DatePickerAndroid.open({
        date: timestamp,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const newTimestamp = setDate(
          setMonth(setYear(timestamp, year), month),
          day
        );
        this.setState(prevState => ({
          timestamp: newTimestamp,
          isDirty: this.getDirtyState({
            ...prevState,
            timestamp: newTimestamp,
          }),
        }));

        this.openAndroidTimePicker();
      } else {
        this.stopEditingTimestamp();
      }
    } catch ({ code, message }) {
      // console.warn("Cannot open date picker", message);
      this.stopEditingTimestamp();
    }
  };

  openAndroidTimePicker = async () => {
    try {
      const { timestamp } = this.state;

      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: getHours(timestamp),
        minute: getMinutes(timestamp),
        is24Hour: false, // TODO: android - Should use something locale specific, respecting system settings?
        mode: "default",
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        const newTimestamp = setMinutes(setHours(timestamp, hour), minute);
        this.setState(prevState => ({
          timestamp: newTimestamp,
          isDirty: this.getDirtyState({
            ...prevState,
            timestamp: newTimestamp,
          }),
        }));
      }
    } catch ({ code, message }) {
      // console.warn("Cannot open time picker", message);
    }

    this.stopEditingTimestamp();
  };

  isAddNoteMode() {
    const { note } = this.props;

    return !note;
  }

  isEditNoteMode() {
    const { note } = this.props;

    return !!note;
  }

  renderDateAndroid() {
    const { timestamp } = this.state;
    const { formattedDate, formattedTime } = formatDateAndTimeForAddOrEditNote(
      timestamp
    );

    return (
      <glamorous.TouchableOpacity
        onPress={this.startEditingTimestamp}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <glamorous.View flexDirection="row">
          <glamorous.Text
            paddingLeft={16}
            style={this.theme.addOrEditNoteDateTextStyle}
          >
            {`${formattedDate} `}
          </glamorous.Text>
          <glamorous.Text style={this.theme.addOrEditNoteTimeTextStyle}>
            {formattedTime}
          </glamorous.Text>
        </glamorous.View>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateEditAndroid() {
    return (
      <glamorous.TouchableOpacity
        onPress={this.startEditingTimestamp}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <glamorous.Text
          paddingRight={16}
          style={this.theme.editButtonTextStyle}
        >
          Edit
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateSectionAndroid() {
    return (
      <glamorous.TouchableOpacity
        activeOpacity={1}
        onPress={this.startEditingTimestamp}
      >
        <glamorous.View
          paddingTop={16}
          paddingBottom={16}
          flexDirection="row"
          justifyContent="space-between"
        >
          {this.renderDateAndroid()}
          {this.renderDateEditAndroid()}
        </glamorous.View>
      </glamorous.TouchableOpacity>
    );
  }

  renderDatePickerIOS() {
    const { timestamp, isEditingTimestamp } = this.state;

    if (isEditingTimestamp) {
      return (
        <DatePickerIOS date={timestamp} onDateChange={this.onDateChangeIOS} />
      );
    }

    return null;
  }

  renderDateIOS() {
    const { timestamp } = this.state;
    const { formattedDate, formattedTime } = formatDateAndTimeForAddOrEditNote(
      timestamp
    );

    return (
      <glamorous.TouchableOpacity
        onPress={this.toggleIsEditingTimestampIOS}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <glamorous.View flexDirection="row">
          <glamorous.Text
            paddingLeft={16}
            style={this.theme.addOrEditNoteDateTextStyle}
          >
            {`${formattedDate} `}
          </glamorous.Text>
          <glamorous.Text style={this.theme.addOrEditNoteTimeTextStyle}>
            {formattedTime}
          </glamorous.Text>
        </glamorous.View>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateEditOrDoneIOS() {
    const { isEditingTimestamp } = this.state;

    return (
      <glamorous.TouchableOpacity
        onPress={this.toggleIsEditingTimestampIOS}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <glamorous.Text
          paddingRight={16}
          style={this.theme.editButtonTextStyle}
        >
          {isEditingTimestamp ? "Done" : "Edit"}
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateSectionIOS() {
    return (
      <glamorous.TouchableOpacity
        activeOpacity={1}
        onPress={this.toggleIsEditingTimestampIOS}
      >
        <glamorous.View
          paddingTop={16}
          paddingBottom={16}
          flexDirection="row"
          justifyContent="space-between"
        >
          {this.renderDateIOS()}
          {this.renderDateEditOrDoneIOS()}
        </glamorous.View>
        {this.renderDatePickerIOS()}
      </glamorous.TouchableOpacity>
    );
  }

  renderDummyTextInputIOS() {
    // FIXME: Track issue affecting blur / dismiss keyboard behavior after showing alert (in particular for the Add Note "Discard Note?" case). After showing this alert, we are unable to programattically blur the TextInput and dismiss keyboard. See: https://github.com/facebook/react-native/issues/17356.
    // HACK: Using this dummy TextInput and using it to help manage keyboard focus helps workaround this issue and gets the same focus behavior as the existing iOS Tidepool Mobile app.
    return (
      <glamorous.TextInput
        innerRef={textInput => {
          this.dummyTextInputIOS = textInput;
        }}
        height={0}
        width={0}
        allowFontScaling={false}
        keyboardAppearance="dark"
        keyboardType="default"
        returnKeyType="default"
        onFocus={() => {
          this.dummyTextInputIOS.blur();
        }}
      />
    );
  }

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor={Colors.darkestGreyColor}
    />
  );

  renderHashtagPicker() {
    const { hashtags } = this.props;

    return (
      <glamorous.View height={64}>
        <HashtagPicker hashtags={hashtags} onPress={this.onPressHashtag} />
      </glamorous.View>
    );
  }

  // FIXME: Looks like ejected app still has about a 20 pixel clipping issue with keyboard on Android, possibly related to status bar height? Or something else? Non-ejected Expo app for Android doesn’t have this issue, neither does iOS. Still need to track this issue. It's probably not a super common case. Need a reasonably long note to notice this. And can still work around it.
  renderNote() {
    const { messageText } = this.state;

    return (
      <glamorous.TextInput
        innerRef={textInput => {
          this.textInput = textInput;
        }}
        style={this.theme.notesListItemTextStyle}
        paddingTop={7}
        paddingLeft={16}
        paddingRight={16}
        paddingBottom={7}
        allowFontScaling={false}
        multiline
        selectionColor="#657ef6"
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
        autoCorrect
        keyboardAppearance="dark"
        keyboardType="default"
        returnKeyType="default"
        onChangeText={this.onChangeText}
        onContentSizeChange={undefined}
        placeholder={"What\u2019s going on?"}
        onFocus={() => {
          this.stopEditingTimestamp();
        }}
        onSelectionChange={this.onSelectionChange}
      >
        <HashtagText
          boldStyle={this.theme.notesListItemHashtagStyle}
          normalStyle={this.theme.notesListItemTextStyle}
          text={messageText}
        />
      </glamorous.TextInput>
    );
  }

  renderHeader() {
    const { isDirty } = this.state;
    const title = this.isEditNoteMode()
      ? ADD_OR_EDIT_SCREEN_EDIT_NOTE_TITLE
      : ADD_OR_EDIT_SCREEN_ADD_NOTE_TITLE;

    const scene = {
      index: 0,
      key: "modal",
      isActive: true,
      descriptor: {
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
                disabled={!isDirty}
              />
            </ThemeProvider>
          ),
        },
      },
    };

    return (
      <Header
        scenes={[scene]}
        scene={scene}
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
                  disabled={!isDirty}
                />
              </ThemeProvider>
            ),
          },
        })}
      />
    );
  }

  render() {
    const { isKeyboardVisible, containerViewY, keyboardY } = this.state;

    const containerViewHeight = isKeyboardVisible
      ? keyboardY - containerViewY
      : null;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          backgroundColor={this.theme.colors.lightBackground}
        >
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          {Platform.OS === "ios" ? this.renderDateSectionIOS() : null}
          {Platform.OS === "android" ? this.renderDateSectionAndroid() : null}
          {this.renderSeparator()}
          {this.renderHashtagPicker()}
          {this.renderSeparator()}
          <glamorous.View
            flex={isKeyboardVisible ? null : 1}
            onLayout={this.onContainerViewLayout}
            height={containerViewHeight}
          >
            {this.renderNote()}
          </glamorous.View>
          {Platform.OS === "ios" ? this.renderDummyTextInputIOS() : null}
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

AddOrEditNoteScreen.propTypes = {
  currentUser: UserPropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }),
  timestampAddNote: PropTypes.instanceOf(Date),
  navigateGoBack: PropTypes.func.isRequired,
  noteUpdateAsync: PropTypes.func.isRequired,
  noteAddAsync: PropTypes.func.isRequired,
  hashtags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

AddOrEditNoteScreen.defaultProps = {
  note: null,
  timestampAddNote: null,
};

export {
  ADD_OR_EDIT_SCREEN_ADD_NOTE_TITLE,
  ADD_OR_EDIT_SCREEN_EDIT_NOTE_TITLE,
};
export default AddOrEditNoteScreen;
