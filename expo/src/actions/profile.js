export const PROFILE_SET_CURRENT_PROFILE = "PROFILE_SET_CURRENT_PROFILE";

export const profileSetCurrentProfile = ({ userId, fullName }) => ({
  type: PROFILE_SET_CURRENT_PROFILE,
  payload: { userId, fullName },
});
