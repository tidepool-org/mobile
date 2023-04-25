import format from "date-fns/format";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import isThisYear from "date-fns/isThisYear";

const formatDateForNoteList = date => {
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

const formatDateAndTimeForAddOrEditNote = date => {
  const formattedDate = format(date, "dddd M/D/YY");
  const formattedTime = format(date, "h:mm a");

  return { formattedDate, formattedTime };
};

export { formatDateForNoteList, formatDateAndTimeForAddOrEditNote };
