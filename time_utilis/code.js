function getRelativeDateHour(daysOffset, hour) {
  var date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function getAbsoluteDateHour(dateTimeString) {
  var date = new Date(Date.parse(dateTimeString))
  return date
}