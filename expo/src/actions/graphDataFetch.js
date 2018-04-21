import api from "../api";

export const GRAPH_DATA_FETCH_DID_START = "GRAPH_DATA_FETCH_DID_START";
export const GRAPH_DATA_FETCH_DID_SUCCEED = "GRAPH_DATA_FETCH_DID_SUCCEED";
export const GRAPH_DATA_FETCH_DID_FAIL = "GRAPH_DATA_FETCH_DID_FAIL";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

export const graphDataFetchDidStart = ({ messageId }) => ({
  type: GRAPH_DATA_FETCH_DID_START,
  payload: { messageId },
});

export const graphDataFetchDidSucceed = ({ messageId, graphData }) => ({
  type: GRAPH_DATA_FETCH_DID_SUCCEED,
  payload: { messageId, graphData },
});

export const graphDataFetchDidFail = ({ messageId, errorMessage }) => ({
  type: GRAPH_DATA_FETCH_DID_FAIL,
  payload: { messageId, errorMessage },
});

export const graphDataFetchAsync = ({
  messageId,
  userId,
  noteDate,
  startDate,
  endDate,
  objectTypes,
  lowBGBoundary,
  highBGBoundary,
}) => async dispatch => {
  dispatch(graphDataFetchDidStart({ messageId }));

  const { graphData, errorMessage } = await api().fetchGraphDataAsync({
    userId,
    noteDate,
    startDate,
    endDate,
    objectTypes,
    lowBGBoundary,
    highBGBoundary,
  });

  if (errorMessage) {
    dispatch(graphDataFetchDidFail({ messageId, errorMessage }));
  } else {
    dispatch(graphDataFetchDidSucceed({ messageId, graphData }));
  }
};
