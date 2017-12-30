import PropTypes from "prop-types";

export const ProfilePropType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});

export const ProfileListItemPropType = PropTypes.shape({
  currentUserId: PropTypes.string.isRequired,
  selectedProfileUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
});
