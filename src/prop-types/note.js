import PropTypes from "prop-types";

const NotePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  messageText: PropTypes.string.isRequired,
});

export { NotePropType };
