export function today(): Date {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}
  
export function addDaysToDate(prevDate: Date, days: number) {
  
  const futureDate = new Date(prevDate);
  futureDate.setDate(prevDate.getDate() + days);

  return futureDate;
}
  
export function addMinuteToDate(prevDate: Date, minutes: number) {
  
  const futureDate = new Date(prevDate);
  futureDate.setMinutes(prevDate.getMinutes() + minutes);

  return futureDate;
}