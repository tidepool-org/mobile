import {
  FIRST_TIME_TIPS_LOAD_DID_FINISH,
  FIRST_TIME_TIPS_SHOW_TIP,
  FIRST_TIME_TIPS_RESET_TIPS,
} from "../actions/firstTimeTips";

const initialFirstTimeTipsState = {
  areSettingsLoaded: false,
  currentTip: null,
};

function firstTimeTips(state = initialFirstTimeTipsState, action) {
  switch (action.type) {
    case FIRST_TIME_TIPS_LOAD_DID_FINISH:
    case FIRST_TIME_TIPS_SHOW_TIP:
    case FIRST_TIME_TIPS_RESET_TIPS: {
      const { areSettingsLoaded, currentTip } = action.payload;
      return { areSettingsLoaded, currentTip };
    }
    default:
      return state;
  }
}

export default firstTimeTips;
