import api from "../api";
import ConnectionStatus from "../models/ConnectionStatus";

const GRAPH_DATA_FETCH_DID_START = "GRAPH_DATA_FETCH_DID_START";
const GRAPH_DATA_FETCH_DID_SUCCEED = "GRAPH_DATA_FETCH_DID_SUCCEED";
const GRAPH_DATA_FETCH_DID_FAIL = "GRAPH_DATA_FETCH_DID_FAIL";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

const graphDataFetchDidStart = ({ messageId }) => ({
  type: GRAPH_DATA_FETCH_DID_START,
  payload: { messageId },
});

const graphDataFetchDidSucceed = ({ messageId, graphData }) => ({
  type: GRAPH_DATA_FETCH_DID_SUCCEED,
  payload: { messageId, graphData },
});

const graphDataFetchDidFail = ({ messageId, errorMessage }) => ({
  type: GRAPH_DATA_FETCH_DID_FAIL,
  payload: { messageId, errorMessage },
});

const graphDataFetchAsync = ({
  messageId,
  userId,
  noteDate,
  startDate,
  endDate,
  objectTypes,
  lowBGBoundary,
  highBGBoundary,
}) => async dispatch => {
  const fetchParams = {
    userId,
    messageId,
    noteDate,
    startDate,
    endDate,
    objectTypes,
    lowBGBoundary,
    highBGBoundary,
  };
  const { graphData: offlineGraphData, isAvailableOffline } = await api().fetchGraphDataAsync(
    fetchParams,
    true // fetchOnlyFromCache
  );

  if (isAvailableOffline) {
    dispatch(
      graphDataFetchDidSucceed({ messageId, graphData: offlineGraphData })
    );
  }

  if (ConnectionStatus.isOnline) {
    if (!isAvailableOffline) {
      dispatch(graphDataFetchDidStart({ messageId }));
    }

    const { graphData, errorMessage } = await api().fetchGraphDataAsync(
      fetchParams
    );

    if (errorMessage) {
      dispatch(graphDataFetchDidFail({ messageId, errorMessage }));
    } else {
      dispatch(graphDataFetchDidSucceed({ messageId, graphData }));
    }
  }
};

export {
  graphDataFetchDidStart,
  graphDataFetchDidSucceed,
  graphDataFetchDidFail,
  graphDataFetchAsync,
  GRAPH_DATA_FETCH_DID_START,
  GRAPH_DATA_FETCH_DID_SUCCEED,
  GRAPH_DATA_FETCH_DID_FAIL,
};
