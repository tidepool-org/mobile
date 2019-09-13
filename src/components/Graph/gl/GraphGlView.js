import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { GLView } from "expo-gl";
import { THREE } from "expo-three";

class GraphGlView extends PureComponent {
  componentDidMount() {
    THREE.suppressExpoWarnings(true);
  }

  render() {
    const { width, height, onContextCreate } = this.props;

    return (
      <GLView width={width} height={height} onContextCreate={onContextCreate} />
    );
  }
}

GraphGlView.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onContextCreate: PropTypes.func.isRequired,
};

export default GraphGlView;
