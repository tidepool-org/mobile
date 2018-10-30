import React, { PureComponent } from "react";
import { Alert, Linking } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import Urls from "../constants/Urls";
import Colors from "../constants/Colors";
import HashtagText from "./HashtagText";
import SignificantTimeChangeNotification from "../models/SignificantTimeChangeNotification";
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
} from "./Graph/helpers";
import Graph from "./Graph/Graph";
import { formatDateForNoteList } from "../utils/formatDate";
import { ThemePropType } from "../prop-types/theme";
import { ProfilePropType } from "../prop-types/profile";

class AddOrEditCommentScreenNote extends PureComponent {
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

    this.state = {
      formattedTimestamp: formatDateForNoteList(props.note.timestamp),
    };
  }

  componentDidMount() {
    SignificantTimeChangeNotification.subscribe(this.timeChanged);
  }

  componentWillUnmount() {
    SignificantTimeChangeNotification.unsubscribe(this.timeChanged);
  }

  timeChanged = () => {
    const { note } = this.props;

    this.setState({
      formattedTimestamp: formatDateForNoteList(note.timestamp),
    });
  };

  shouldRenderUserLabelSection() {
    const { note } = this.props;
    return note.userId !== note.groupId && note.userFullName;
  }

  renderUserLabelSection() {
    const { theme, currentProfile, note } = this.props;

    const userLabelText = `${note.userFullName} to ${currentProfile.fullName}`;

    return (
      <glamorous.View flexDirection="row" justifyContent="space-between">
        <glamorous.Text
          allowFontScaling={false}
          numberOfLines={1}
          style={theme.notesListItemMetadataStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
          flexShrink={1}
        >
          {userLabelText}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  renderGraph() {
    const {
      graphDataFetchData: {
        fetching,
        graphData: {
          cbgData,
          smbgData,
          basalData,
          maxBasalValue,
          bolusData,
          maxBolusValue,
          minBolusScaleValue,
          wizardData,
        },
      },
      currentProfile: { lowBGBoundary, highBGBoundary },
      note: { timestamp: eventTime },
      graphRenderer,
      onGraphZoomStart,
      onGraphZoomEnd,
    } = this.props;

    const isLoading = fetching;
    const yAxisLabelValues = makeYAxisLabelValues({
      lowBGBoundary,
      highBGBoundary,
    });
    const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({
      lowBGBoundary,
      highBGBoundary,
    });
    const navigateHowToUpload = () => {
      Linking.openURL(Urls.howToUpload);
    };

    return (
      <Graph
        isLoading={isLoading}
        yAxisLabelValues={yAxisLabelValues}
        yAxisBGBoundaryValues={yAxisBGBoundaryValues}
        cbgData={cbgData}
        smbgData={smbgData}
        basalData={basalData}
        maxBasalValue={maxBasalValue}
        bolusData={bolusData}
        maxBolusValue={maxBolusValue}
        minBolusScaleValue={minBolusScaleValue}
        wizardData={wizardData}
        eventTime={eventTime}
        navigateHowToUpload={navigateHowToUpload}
        graphRenderer={graphRenderer}
        onZoomStart={onGraphZoomStart}
        onZoomEnd={onGraphZoomEnd}
      />
    );
  }

  renderDateSection() {
    const { theme, note } = this.props;
    const { formattedTimestamp } = this.state;

    return (
      <glamorous.View flexDirection="row" justifyContent="flex-start">
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemMetadataStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
        >
          {formattedTimestamp}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  renderNote() {
    const { theme, note } = this.props;

    return (
      <glamorous.Text
        allowFontScaling={false}
        style={theme.notesListItemTextStyle}
        flexDirection="row"
        marginTop={7}
        marginLeft={12}
        marginRight={12}
        marginBottom={7}
      >
        <HashtagText
          boldStyle={theme.notesListItemHashtagStyle}
          normalStyle={theme.notesListItemTextStyle}
          text={note.messageText}
        />
      </glamorous.Text>
    );
  }

  render() {
    return (
      <glamorous.View backgroundColor={Colors.white}>
        <glamorous.View>
          {this.shouldRenderUserLabelSection() && this.renderUserLabelSection()}
          {this.renderDateSection()}
          {this.renderNote()}
          {this.renderGraph()}
        </glamorous.View>
      </glamorous.View>
    );
  }
}

AddOrEditCommentScreenNote.propTypes = {
  theme: ThemePropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }).isRequired,
  graphDataFetchData: PropTypes.shape({
    graphData: PropTypes.object,
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
  graphRenderer: PropTypes.string.isRequired,
  onGraphZoomStart: PropTypes.func,
  onGraphZoomEnd: PropTypes.func,
};

AddOrEditCommentScreenNote.defaultProps = {
  graphDataFetchData: {
    graphData: {},
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
  onGraphZoomStart: null,
  onGraphZoomEnd: null,
};

export default withTheme(AddOrEditCommentScreenNote);
