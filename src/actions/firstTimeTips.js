import FirstTimeTips from "../models/FirstTimeTips";

const FIRST_TIME_TIPS_LOAD_DID_FINISH = "FIRST_TIME_TIPS_LOAD_DID_FINISH";
const FIRST_TIME_TIPS_SHOW_TIP = "FIRST_TIME_TIPS_SHOW_TIP";
const FIRST_TIME_TIPS_RESET_TIPS = "FIRST_TIME_TIPS_RESET_TIPS";

const firstTimeTipsLoadSettingsAsync = () => async dispatch => {
  await FirstTimeTips.loadSettingsAsync();
  dispatch({
    type: FIRST_TIME_TIPS_LOAD_DID_FINISH,
    payload: FirstTimeTips,
  });
};

const firstTimeTipsShowTip = (tip, show) => {
  FirstTimeTips.showTip(tip, show);
  return {
    type: FIRST_TIME_TIPS_SHOW_TIP,
    payload: FirstTimeTips,
  };
};

const firstTimeTipsResetTips = () => async dispatch => {
  FirstTimeTips.resetTips({ saveSettings: true });
  dispatch({
    type: FIRST_TIME_TIPS_RESET_TIPS,
    payload: FirstTimeTips,
  });
};

export {
  firstTimeTipsLoadSettingsAsync,
  firstTimeTipsShowTip,
  firstTimeTipsResetTips,
  FIRST_TIME_TIPS_LOAD_DID_FINISH,
  FIRST_TIME_TIPS_SHOW_TIP,
  FIRST_TIME_TIPS_RESET_TIPS,
};
