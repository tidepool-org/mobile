import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Expo from "expo";
import { THREE } from "expo-three";

class GraphGlView extends PureComponent {
  componentDidMount() {
    THREE.suppressExpoWarnings(true);
  }

  render() {
    const { width, height, onContextCreate } = this.props;

    return (
      <Expo.GLView
        width={width}
        height={height}
        onContextCreate={onContextCreate}
      />
    );
  }
}

GraphGlView.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onContextCreate: PropTypes.func.isRequired,
};

export default GraphGlView;
