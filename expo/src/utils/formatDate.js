import format from "date-fns/format";
import isYesterday from "date-fns/is_yesterday";
import isToday from "date-fns/is_today";
import isThisYear from "date-fns/is_this_year";

const formatDate = date => {
  let dayString;
  if (isToday(date)) {
    dayString = "Today";
  } else if (isYesterday(date)) {
    dayString = "Yesterday";
  } else if (isThisYear(date)) {
    dayString = format(date, "MMM D");
  } else {
    dayString = format(date, "MMM D, YYYY");
  }

  const timeString = format(date, "h:mm a");

  return `${dayString} at ${timeString}`;
};

export default formatDate;
