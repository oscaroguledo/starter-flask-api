export const formatDate = (inputDate) => {
  // Split the input date string into date and time parts
  const [datePart, timePart] = inputDate.split("T");

  // Extract year, month, and day from the date part
  const [year, month, day] = datePart.split("-");

  // Extract hour and minute from the time part
  const [hour, minute] = timePart.slice(0, -5).split(":"); // Remove ".000Z" and split by ":" to get hour and minute

  // Define month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert hour to 12-hour format and determine AM/PM
  let formattedHour = parseInt(hour, 10);
  const amPm = formattedHour >= 12 ? "PM" : "AM";
  formattedHour = formattedHour % 12 || 12;

  // Format the date string
  const formattedDate = `${days[new Date(inputDate).getDay()]} ${day} ${
    monthNames[month - 1]
  } ${year} at ${formattedHour}:${minute} ${amPm}`;

  return formattedDate;
};
