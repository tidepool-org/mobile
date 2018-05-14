import {
  GRAPH_RENDERER_SET,
  GRAPH_RENDERER_THREE_JS,
} from "../actions/graphRenderer";

const initialState = GRAPH_RENDERER_THREE_JS;

function graphRenderer(state = initialState, action) {
  switch (action.type) {
    case GRAPH_RENDERER_SET:
      return action.payload;
    default:
      return state;
  }
}

export default graphRenderer;
