const NAVIGATE_LAUNCH = "NAVIGATE_LAUNCH";
const NAVIGATE_HOME = "NAVIGATE_HOME";
const NAVIGATE_SIGN_IN = "NAVIGATE_SIGN_IN";
const NAVIGATE_SIGN_UP = "NAVIGATE_SIGN_UP";
const NAVIGATE_SIGN_UP_CREATE_ACCOUNT_CLINICIAN =
  "NAVIGATE_SIGN_UP_CREATE_ACCOUNT_CLINICIAN";
const NAVIGATE_SIGN_UP_CREATE_ACCOUNT_PERSONAL =
  "NAVIGATE_SIGN_UP_CREATE_ACCOUNT_PERSONAL";
const NAVIGATE_SIGN_UP_CLINICIAN_SETUP = "NAVIGATE_SIGN_UP_CLINICIAN_SETUP";
const NAVIGATE_SIGN_UP_TERMS_OF_USE = "NAVIGATE_SIGN_UP_TERMS_OF_USE";
const NAVIGATE_SIGN_UP_DIABETES_DETAILS = "NAVIGATE_SIGN_UP_DIABETES_DETAILS";
const NAVIGATE_SIGN_UP_DONATE_DATA = "NAVIGATE_SIGN_UP_DONATE_DATA";
const NAVIGATE_SIGN_UP_ACTIVATE_ACCOUNT = "NAVIGATE_SIGN_UP_ACTIVATE_ACCOUNT";
const NAVIGATE_FORGOT_PASSWORD = "NAVIGATE_FORGOT_PASSWORD";
const NAVIGATE_HOW_TO_UPLOAD = "NAVIGATE_HOW_TO_UPLOAD";
const NAVIGATE_HEALTH_SYNC = "NAVIGATE_HEALTH_SYNC";
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
const NAVIGATE_DEBUG_HEALTH_SCREEN = "NAVIGATE_DEBUG_HEALTH_SCREEN";

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

function navigateSignUpCreateAccountClinician() {
  return { type: NAVIGATE_SIGN_UP_CREATE_ACCOUNT_CLINICIAN };
}

function navigateSignUpCreateAccountPersonal() {
  return { type: NAVIGATE_SIGN_UP_CREATE_ACCOUNT_PERSONAL };
}

function navigateSignUpClinicianSetup() {
  return { type: NAVIGATE_SIGN_UP_CLINICIAN_SETUP };
}

function navigateSignUpTermsOfUse() {
  return { type: NAVIGATE_SIGN_UP_TERMS_OF_USE };
}

function navigateSignUpDiabetesDetails() {
  return { type: NAVIGATE_SIGN_UP_DIABETES_DETAILS };
}

function navigateSignUpDonateData() {
  return { type: NAVIGATE_SIGN_UP_DONATE_DATA };
}

function navigateSignUpActivateAccount() {
  return { type: NAVIGATE_SIGN_UP_ACTIVATE_ACCOUNT };
}

function navigateForgotPassword() {
  return { type: NAVIGATE_FORGOT_PASSWORD };
}

function navigateHowToUpload() {
  return { type: NAVIGATE_HOW_TO_UPLOAD };
}

function navigateHealthSync({ isInitialSync = false }) {
  return { type: NAVIGATE_HEALTH_SYNC, payload: { isInitialSync } };
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

function navigateAddComment({ note }) {
  return { type: NAVIGATE_ADD_COMMENT, payload: { note } };
}

function navigateEditComment({ note, comment }) {
  return {
    type: NAVIGATE_EDIT_COMMENT,
    payload: { note, comment },
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

function navigateDebugHealthScreen() {
  return { type: NAVIGATE_DEBUG_HEALTH_SCREEN };
}

export {
  navigateLaunch,
  navigateHome,
  navigateSignIn,
  navigateSignUp,
  navigateSignUpCreateAccountClinician,
  navigateSignUpCreateAccountPersonal,
  navigateSignUpClinicianSetup,
  navigateSignUpTermsOfUse,
  navigateSignUpDiabetesDetails,
  navigateSignUpDonateData,
  navigateSignUpActivateAccount,
  navigateForgotPassword,
  navigateHowToUpload,
  navigateHealthSync,
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
  navigateDebugHealthScreen,
  NAVIGATE_LAUNCH,
  NAVIGATE_HOME,
  NAVIGATE_SIGN_IN,
  NAVIGATE_SIGN_UP,
  NAVIGATE_SIGN_UP_CREATE_ACCOUNT_CLINICIAN,
  NAVIGATE_SIGN_UP_CREATE_ACCOUNT_PERSONAL,
  NAVIGATE_SIGN_UP_CLINICIAN_SETUP,
  NAVIGATE_SIGN_UP_TERMS_OF_USE,
  NAVIGATE_SIGN_UP_DIABETES_DETAILS,
  NAVIGATE_SIGN_UP_DONATE_DATA,
  NAVIGATE_SIGN_UP_ACTIVATE_ACCOUNT,
  NAVIGATE_FORGOT_PASSWORD,
  NAVIGATE_HOW_TO_UPLOAD,
  NAVIGATE_HEALTH_SYNC,
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
  NAVIGATE_DEBUG_HEALTH_SCREEN,
};
