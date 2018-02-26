import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
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
import { formatDateAndTimeForAddOrEditNote } from "../utils/formatDate";
import { ProfilePropType } from "../prop-types/profile";
import { UserPropType } from "../prop-types/user";

// TODO: refactor - Refactor this screen. It's too complex and responsible for too much, it seems
// TODO: refactor - Factor out some of the modal screen support
// TODO: refactor - Consider also using react navigation modal, and the factored out modal screen support, for Debug Settings

// TODO: polish - animation - The animation between "Edit" and "Done" for iOS doesn't look great (compare with iOS Tidepool Mobile spp)
// TODO: polish - android - Style the date and time pickers with better theme colors?
// TODO: polish - ios - (also android?) - when presenting modal, there's sometimes kind of a flash (white?) .. this seems to be the DrawerNavigator rendering briefly during the presentation of the modal?

// FIXME: Now that we moved back to adjustResize (from adjustPan), the Add Note is clipped a bit for Android when input gets to bottom. Look at fixing Add Note to work more like Add/Edit Comment re: keyboard handling, etc
// FIXME: Android doesn't auto-scroll as text for the TextInput goes beyond the fixed height. This is apparently fixed in 0.52, which we're not on yet. See: https://github.com/facebook/react-native/issues/12799. Confirmed this is fixed in 0.52. The ejected app will move to 0.52, but expo is still behind. Once that catches up we can remove this FIXME since it will be fixed in both ejected and expo.
// FIXME: Currently we're handling keyboard hide/show events to ajust size of the TextInput. Ideally should be able to simplify with KeyboardAvoidingView, but, see: https://github.com/facebook/react-native/issues/16826
// FIXME: We're importing Header directly and rendering in this modal, rather than getting that for free as part of navigator. This is needed due to bugs in React Navigation related to double headers with nested navigators. We have to set headerMode to 'none' for the modal stack navigator (like the one presenting this screen), which prevents the double header on the parent navigator, but, also removes it from the nested one.

export const ADD_OR_EDIT_SCREEN_ADD_NOTE_TITLE = "Add Note";
export const ADD_OR_EDIT_SCREEN_EDIT_NOTE_TITLE = "Edit Note";

class AddOrEditNoteScreen extends PureComponent {
  static navigationOptions = () => ({
    gesturesEnabled: false, // Disable the pull down gesture for dismissing the modal screen
  });

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;

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
    if (!this.state.isKeyboardVisible) {
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

  setIsEditingTimestamp = isEditingTimestamp => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 175,
      useNativeDriver: true,
    });

    if (isEditingTimestamp) {
      this.textInput.blur();
      if (this.dummyTextInputIOS) {
        this.dummyTextInputIOS.focus();
      }
    }

    this.setState({
      isEditingTimestamp,
    });
  };

  toggleIsEditingTimestampIOS = () => {
    this.setIsEditingTimestamp(!this.state.isEditingTimestamp);
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
    this.props.navigateGoBack();
    this.textInput.blur();
    if (this.dummyTextInputIOS) {
      this.dummyTextInputIOS.focus();
    }
  };

  saveAndGoBack = () => {
    const { currentUser, currentProfile, note } = this.props;

    if (this.isEditNoteMode()) {
      const editedNote = {
        ...note,
        messageText: this.state.messageText.trim(),
        timestamp: this.state.timestamp,
      };
      this.props.noteUpdateAsync({
        currentUser,
        currentProfile,
        note: editedNote,
      });
    } else {
      this.props.noteAddAsync({
        currentUser,
        currentProfile,
        messageText: this.state.messageText.trim(),
        timestamp: this.state.timestamp,
      });
    }
    this.props.navigateGoBack();
    this.textInput.blur();
    if (this.dummyTextInputIOS) {
      this.dummyTextInputIOS.focus();
    }
  };

  showSaveChangesAlert = () => {
    Alert.alert(
      "Save Changes?",
      "You have made changes to this note. Would you like to save these changes?",
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

  showDiscardNoteAlert = () => {
    Alert.alert(
      "Discard Note?",
      "If you close this note, your note will be lost.",
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

  isAddNoteMode() {
    return !this.props.note;
  }

  isEditNoteMode() {
    return !!this.props.note;
  }

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
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.timestamp,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const timestamp = setDate(
          setMonth(setYear(this.state.timestamp, year), month),
          day
        );
        this.setState(prevState => ({
          timestamp,
          isDirty: this.getDirtyState({ ...prevState, timestamp }),
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
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: getHours(this.state.timestamp),
        minute: getMinutes(this.state.timestamp),
        is24Hour: false, // TODO: android - Should use something locale specific, respecting system settings?
        mode: "default",
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        const timestamp = setMinutes(
          setHours(this.state.timestamp, hour),
          minute
        );
        this.setState(prevState => ({
          timestamp,
          isDirty: this.getDirtyState({ ...prevState, timestamp }),
        }));
      }
    } catch ({ code, message }) {
      // console.warn("Cannot open time picker", message);
    }

    this.stopEditingTimestamp();
  };

  renderDateAndroid() {
    const { formattedDate, formattedTime } = formatDateAndTimeForAddOrEditNote(
      this.state.timestamp
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
          {"Edit"}
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateSectionAndroid() {
    return (
      <glamorous.TouchableOpacity
        activeOpacity={1}
        paddingBottom={8}
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
        <glamorous.View
          height={StyleSheet.hairlineWidth}
          backgroundColor={Colors.darkestGreyColor}
        />
      </glamorous.TouchableOpacity>
    );
  }

  renderDatePickerIOS() {
    if (this.state.isEditingTimestamp) {
      return (
        <DatePickerIOS
          date={this.state.timestamp}
          onDateChange={this.onDateChangeIOS}
        />
      );
    }

    return null;
  }

  renderDateIOS() {
    const { formattedDate, formattedTime } = formatDateAndTimeForAddOrEditNote(
      this.state.timestamp
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
    return (
      <glamorous.TouchableOpacity
        onPress={this.toggleIsEditingTimestampIOS}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      >
        <glamorous.Text
          paddingRight={16}
          style={this.theme.editButtonTextStyle}
        >
          {this.state.isEditingTimestamp ? "Done" : "Edit"}
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  renderDateSectionIOS() {
    return (
      <glamorous.TouchableOpacity
        activeOpacity={1}
        paddingBottom={8}
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
        <glamorous.View
          height={StyleSheet.hairlineWidth}
          backgroundColor={Colors.darkestGreyColor}
        />
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

  renderNote() {
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
        style={this.theme.notesListItemTextStyle}
        paddingTop={7}
        paddingLeft={16}
        paddingRight={16}
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
        placeholder={"What\u2019s going on?"}
        onFocus={() => {
          this.stopEditingTimestamp();
        }}
      >
        <HashtagText
          boldStyle={this.theme.notesListItemHashtagStyle}
          normalStyle={this.theme.notesListItemTextStyle}
          text={this.state.messageText}
        />
      </glamorous.TextInput>
    );
  }

  renderHeader() {
    const title = this.isEditNoteMode()
      ? ADD_OR_EDIT_SCREEN_EDIT_NOTE_TITLE
      : ADD_OR_EDIT_SCREEN_ADD_NOTE_TITLE;

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

  render() {
    const containerViewHeight = this.state.isKeyboardVisible
      ? this.state.keyboardY - this.state.containerViewY
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
          <glamorous.View
            flex={this.state.isKeyboardVisible ? null : 1}
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
};

AddOrEditNoteScreen.defaultProps = {
  note: null,
  timestampAddNote: null,
};

export default AddOrEditNoteScreen;
