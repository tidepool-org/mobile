export const PROFILE_SET = "PROFILE_SET";

export const profileSet = ({ userId, fullName }) => ({
  type: PROFILE_SET,
  payload: { userId, fullName },
});
