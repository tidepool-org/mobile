const NAVIGATE_LAUNCH = "NAVIGATE_LAUNCH";
const NAVIGATE_HOME = "NAVIGATE_HOME";
const NAVIGATE_SIGN_IN = "NAVIGATE_SIGN_IN";
const NAVIGATE_SIGN_UP = "NAVIGATE_SIGN_UP";
const NAVIGATE_FORGOT_PASSWORD = "NAVIGATE_FORGOT_PASSWORD";
const NAVIGATE_HOW_TO_UPLOAD = "NAVIGATE_HOW_TO_UPLOAD";
const NAVIGATE_SWITCH_PROFILE = "NAVIGATE_SWITCH_PROFILE";
const NAVIGATE_ADD_NOTE = "NAVIGATE_ADD_NOTE";
const NAVIGATE_EDIT_NOTE = "NAVIGATE_EDIT_NOTE";
const NAVIGATE_ADD_COMMENT = "NAVIGATE_ADD_COMMENT";
const NAVIGATE_EDIT_COMMENT = "NAVIGATE_EDIT_COMMENT";
const NAVIGATE_PRIVACY_AND_TERMS = "NAVIGATE_PRIVACY_AND_TERMS";
const NAVIGATE_SUPPORT = "NAVIGATE_SUPPORT";
const NAVIGATE_DRAWER_OPEN = "NAVIGATE_DRAWER_OPEN";
const NAVIGATE_DRAWER_CLOSE = "NAVIGATE_DRAWER_CLOSE";
const NAVIGATE_DEBUG_SETTINGS = "NAVIGATE_DEBUG_SETTINGS";
const NAVIGATE_GO_BACK = "NAVIGATE_GO_BACK";

function navigateLaunch() {
  return { type: NAVIGATE_LAUNCH };
}

function navigateHome() {
  return { type: NAVIGATE_HOME };
}

function navigateSignIn() {
  return { type: NAVIGATE_SIGN_IN };
}

function navigateSignUp() {
  return { type: NAVIGATE_SIGN_UP };
}

function navigateForgotPassword() {
  return { type: NAVIGATE_FORGOT_PASSWORD };
}

function navigateHowToUpload() {
  return { type: NAVIGATE_HOW_TO_UPLOAD };
}

function navigateSwitchProfile() {
  return { type: NAVIGATE_SWITCH_PROFILE };
}

function navigateAddNote() {
  return { type: NAVIGATE_ADD_NOTE, payload: { note: null } };
}

function navigateEditNote({ note }) {
  return { type: NAVIGATE_EDIT_NOTE, payload: { note } };
}

function navigateAddComment({ note, commentsFetchData }) {
  return { type: NAVIGATE_ADD_COMMENT, payload: { note, commentsFetchData } };
}

function navigateEditComment({ note, commentsFetchData, comment }) {
  return {
    type: NAVIGATE_EDIT_COMMENT,
    payload: { note, commentsFetchData, comment },
  };
}

function navigatePrivacyAndTerms() {
  return { type: NAVIGATE_PRIVACY_AND_TERMS };
}

function navigateSupport() {
  return { type: NAVIGATE_SUPPORT };
}

function navigateDrawerOpen() {
  return { type: NAVIGATE_DRAWER_OPEN };
}

function navigateDrawerClose() {
  return { type: NAVIGATE_DRAWER_CLOSE };
}

function navigateDebugSettings() {
  return { type: NAVIGATE_DEBUG_SETTINGS };
}

function navigateGoBack() {
  return { type: NAVIGATE_GO_BACK };
}

export {
  navigateLaunch,
  navigateHome,
  navigateSignIn,
  navigateSignUp,
  navigateForgotPassword,
  navigateHowToUpload,
  navigateSwitchProfile,
  navigateAddNote,
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
  navigatePrivacyAndTerms,
  navigateSupport,
  navigateDrawerOpen,
  navigateDrawerClose,
  navigateDebugSettings,
  navigateGoBack,
  NAVIGATE_LAUNCH,
  NAVIGATE_HOME,
  NAVIGATE_SIGN_IN,
  NAVIGATE_SIGN_UP,
  NAVIGATE_FORGOT_PASSWORD,
  NAVIGATE_HOW_TO_UPLOAD,
  NAVIGATE_SWITCH_PROFILE,
  NAVIGATE_ADD_NOTE,
  NAVIGATE_EDIT_NOTE,
  NAVIGATE_ADD_COMMENT,
  NAVIGATE_EDIT_COMMENT,
  NAVIGATE_PRIVACY_AND_TERMS,
  NAVIGATE_SUPPORT,
  NAVIGATE_DRAWER_OPEN,
  NAVIGATE_DRAWER_CLOSE,
  NAVIGATE_DEBUG_SETTINGS,
  NAVIGATE_GO_BACK,
};
