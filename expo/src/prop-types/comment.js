import PropTypes from "prop-types";

export const CommentPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  messageText: PropTypes.string.isRequired,
  userFullName: PropTypes.string.isRequired,
});
