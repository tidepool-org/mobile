import React, { PureComponent } from "react";
import { Alert, Linking } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import Urls from "../constants/Urls";
import Colors from "../../src/constants/Colors";
import HashtagText from "./HashtagText";
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
        graphData: { cbgData, smbgData },
      },
      currentProfile: { lowBGBoundary, highBGBoundary },
      note: { timestamp: eventTime },
      graphRenderer,
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
        eventTime={eventTime}
        navigateHowToUpload={navigateHowToUpload}
        onZoomStart={() => {}}
        onZoomEnd={() => {}}
        graphRenderer={graphRenderer}
      />
    );
  }

  renderDateSection() {
    const { theme, note } = this.props;

    return (
      <glamorous.View flexDirection="row" justifyContent="flex-start">
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemMetadataStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
        >
          {formatDateForNoteList(note.timestamp)}
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
};

AddOrEditCommentScreenNote.defaultProps = {
  graphDataFetchData: {
    graphData: {},
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
};

export default withTheme(AddOrEditCommentScreenNote);
