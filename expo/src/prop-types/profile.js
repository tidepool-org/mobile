import PropTypes from "prop-types";

const ProfilePropType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  lowBGBoundary: PropTypes.number.isRequired,
  highBGBoundary: PropTypes.number.isRequired,
});

const ProfileListItemPropType = PropTypes.shape({
  currentUserId: PropTypes.string.isRequired,
  selectedProfileUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});

export { ProfilePropType, ProfileListItemPropType };
