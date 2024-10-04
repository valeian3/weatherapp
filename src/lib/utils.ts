export function getDayOfWeek(dateString: string): string {
  // Create an array with day names
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Parse the date string
  const date = new Date(dateString);

  // Get the current date
  const today = new Date();

  // Check if the provided date is today
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Get the day of the week as a number (0-6)
  const dayIndex = date.getDay();

  // Return the day name from the array
  return daysOfWeek[dayIndex];
}
