import PropTypes from "prop-types";

export const NotePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  messageText: PropTypes.string.isRequired,
});
