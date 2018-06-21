import { AsyncStorage } from "react-native";

import {
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from "../components/Graph/helpers";

const GRAPH_RENDERER_SET = "GRAPH_RENDERER_SET";

const GRAPH_RENDERER_KEY = "GRAPH_RENDERER_KEY";

const graphRenderers = [GRAPH_RENDERER_SVG, GRAPH_RENDERER_THREE_JS];

const graphRendererSet = graphRenderer => ({
  type: GRAPH_RENDERER_SET,
  payload: graphRenderer,
});

const graphRendererLoadAndSetAsync = () => async dispatch => {
  let graphRenderer = GRAPH_RENDERER_THREE_JS;
  try {
    graphRenderer = await AsyncStorage.getItem(GRAPH_RENDERER_KEY);

    if (!graphRenderer || !graphRenderers.includes(graphRenderer)) {
      // console.log(
      //   `No graphRenderer was saved, defaulting to ${GRAPH_RENDERER_THREE_JS}`
      // );
      graphRenderer = GRAPH_RENDERER_THREE_JS;
    } else {
      // console.log(
      //   `graphRendererLoadAndSetAsync succeeded, graphRenderer: ${graphRenderer}`
      // );
    }
  } catch (error) {
    // console.log(
    //   `Failed to load graphRenderer, defaulting to ${GRAPH_RENDERER_THREE_JS}, error: ${error}`
    // );
  }

  dispatch(graphRendererSet(graphRenderer));
};

const graphRendererSetAndSaveAsync = graphRenderer => async dispatch => {
  try {
    AsyncStorage.setItem(GRAPH_RENDERER_KEY, graphRenderer);
    // console.log(
    //   `graphRendererSetAndSaveAsync save succeeded, graphRenderer: ${graphRenderer}`
    // );
  } catch (error) {
    // console.log(
    //   `graphRendererSetAndSaveAsync failed to save graphRenderer, error: ${error}`
    // );
  }

  dispatch(graphRendererSet(graphRenderer));
};

export {
  graphRendererSet,
  graphRendererLoadAndSetAsync,
  graphRendererSetAndSaveAsync,
  GRAPH_RENDERER_SET,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
};
