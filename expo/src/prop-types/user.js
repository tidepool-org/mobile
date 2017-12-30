import PropTypes from "prop-types";

export const AuthUserPropType = PropTypes.shape({
  sessionToken: PropTypes.string,
  signingIn: PropTypes.bool,
  errorMessage: PropTypes.string,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});

export const AuthUserDefaultProps = {
  sessionToken: "",
  signingIn: false,
  errorMessage: "",
};

export const UserPropType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});
