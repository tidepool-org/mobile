import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsGraphRendererListItem from "./DebugSettingsGraphRendererListItem";

const graphRenderers = [{ name: "SVG" }, { name: "Three.js (OpenGL)" }];

class DebugSettingsGraphRendererList extends PureComponent {
  onPress = graphRenderer => {
    this.props.onGraphRendererSelected(graphRenderer);
  };

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => (
    <DebugSettingsGraphRendererListItem
      key={item.name}
      graphRenderer={item.name}
      onPress={this.onPress}
      selected={item.name === this.props.selectedGraphRenderer}
    />
  );

  render() {
    const { theme } = this.props;

    return (
      <glamorous.View>
        <glamorous.Text
          style={theme.debugSettingsSectionTitleStyle}
          marginTop={8}
          marginLeft={15}
          marginBottom={8}
        >
          {"Graph Renderer".toLocaleUpperCase()}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={graphRenderers}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsGraphRendererList.propTypes = {
  theme: ThemePropType.isRequired,
  onGraphRendererSelected: PropTypes.func.isRequired,
  selectedGraphRenderer: PropTypes.string,
};

DebugSettingsGraphRendererList.defaultProps = {
  selectedGraphRenderer: "",
};

export default withTheme(DebugSettingsGraphRendererList);
