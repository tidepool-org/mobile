import PropTypes from "prop-types";

const ThemePropType = PropTypes.shape({
  signInEditFieldStyle: PropTypes.objectOf(PropTypes.any),
  drawerMenuButton: PropTypes.objectOf(PropTypes.any),
  colors: PropTypes.objectOf(PropTypes.string),
});

export { ThemePropType };
