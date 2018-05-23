import PropTypes from "prop-types";

const AuthUserPropType = PropTypes.shape({
  sessionToken: PropTypes.string,
  signingIn: PropTypes.bool,
  errorMessage: PropTypes.string,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});

const AuthUserDefaultProps = {
  sessionToken: "",
  signingIn: false,
  errorMessage: "",
};

const UserPropType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});

export { AuthUserPropType, AuthUserDefaultProps, UserPropType };
