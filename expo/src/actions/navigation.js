export const NAVIGATE_LAUNCH = "NAVIGATE_LAUNCH";
export const NAVIGATE_HOME = "NAVIGATE_HOME";
export const NAVIGATE_SIGN_IN = "NAVIGATE_SIGN_IN";
export const NAVIGATE_SIGN_UP = "NAVIGATE_SIGN_UP";
export const NAVIGATE_FORGOT_PASSWORD = "NAVIGATE_FORGOT_PASSWORD";
export const NAVIGATE_SWITCH_PROFILE = "NAVIGATE_SWITCH_PROFILE";
export const NAVIGATE_PRIVACY_AND_TERMS = "NAVIGATE_PRIVACY_AND_TERMS";
export const NAVIGATE_SUPPORT = "NAVIGATE_SUPPORT";
export const NAVIGATE_SIGN_DRAWER_OPEN = "NAVIGATE_SIGN_DRAWER_OPEN";
export const NAVIGATE_SIGN_DRAWER_CLOSE = "NAVIGATE_SIGN_DRAWER_CLOSE";
export const NAVIGATE_DEBUG_SETTINGS = "NAVIGATE_DEBUG_SETTINGS";
export const NAVIGATE_GO_BACK = "NAVIGATE_GO_BACK";

export function navigateLaunch() {
  return { type: NAVIGATE_LAUNCH };
}

export function navigateHome() {
  return { type: NAVIGATE_HOME };
}

export function navigateSignIn() {
  return { type: NAVIGATE_SIGN_IN };
}

export function navigateSignUp() {
  return { type: NAVIGATE_SIGN_UP };
}

export function navigateForgotPassword() {
  return { type: NAVIGATE_FORGOT_PASSWORD };
}

export function navigateSwitchProfile() {
  return { type: NAVIGATE_SWITCH_PROFILE };
}

export function navigatePrivacyAndTerms() {
  return { type: NAVIGATE_PRIVACY_AND_TERMS };
}

export function navigateSupport() {
  return { type: NAVIGATE_SUPPORT };
}

export function navigateDrawerOpen() {
  return { type: NAVIGATE_SIGN_DRAWER_OPEN };
}

export function navigateDrawerClose() {
  return { type: NAVIGATE_SIGN_DRAWER_CLOSE };
}

export function navigateDebugSettings() {
  return { type: NAVIGATE_DEBUG_SETTINGS };
}

export function navigateGoBack() {
  return { type: NAVIGATE_GO_BACK };
}
