export const AUTH_SET_CURRENT_PROFILE = "AUTH_SET_CURRENT_PROFILE";

export const profileSetCurrentProfile = ({ userId, fullName }) => ({
  type: AUTH_SET_CURRENT_PROFILE,
  payload: { userId, fullName },
});
