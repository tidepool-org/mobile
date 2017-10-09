import PropTypes from "prop-types";

const ThemePropTypes = PropTypes.shape({
  signInEditFieldStyle: PropTypes.objectOf(PropTypes.any),
  colors: PropTypes.objectOf(PropTypes.string),
});

export default ThemePropTypes;
