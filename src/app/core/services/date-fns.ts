import { isEmpty } from "./utils";

export function now() {
  return new Date();
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function toDate(dateString: string) {
  return new Date(dateString + " " + "00:00:00");
}

export function toSimpleDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function toSimpleTime(date: Date): string {
  return date.toTimeString().split(' ')[0];
}

export function timeToDate(time: string) {
  return new Date(toSimpleDate(now()) + " " + time);
}

export function toDateTime(dateString: Date | string, time:string) {
  if (dateString instanceof Date) {
    return new Date(toSimpleDate(dateString)+" " + time);
  }
  if (isEmpty(time)) {
    return new Date(dateString);
  }
  return new Date(dateString + " " + time);
}

export function toMysqlDateTime(date: Date): string {
    return toSimpleDate(date) + ' ' + toSimpleTime(date);
}
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function subMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function subHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() - hours);
  return result;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Not Sunday or Saturday
}

export function isMonday(date: Date): boolean {
  return date.getDay() === 1; // 1 = Monday
}

export function isFriday(date: Date): boolean {
  return date.getDay() === 5; // 5 = Friday
}

export function isEvening(date: Date) {
  const hourOfDay = date.getHours();
  return hourOfDay >= 18; // starts @ 6PM
}

export function isMorning(date: Date) {
  const hourOfDay = date.getHours();
  return hourOfDay < 12; // before 12-noon
}

export function isAfternoon(date: Date) {
  const hourOfDay = date.getHours();
  return hourOfDay >= 12 && hourOfDay < 18; // from 12-noon, before 6PM
}

export function isGreaterThan(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

export function isLessThan(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

export function isEqual(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatTime(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(date: Date, locale: string = 'en-US'): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

export function parseDate(dateString: string, locale: string = 'en-US'): Date {
  return new Date(dateString);
}

export function parseDateTime(dateTimeString: string, locale: string = 'en-US'): Date {
  const [datePart, timePart] = dateTimeString.split(' ');
  const date = parseDate(datePart, locale);
  const time = parseDate(timePart, locale);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
}

export function isValidDateString(dateString: string, locale: string = 'en-US'): boolean {
  const date = parseDate(dateString, locale);
  return !isNaN(date.getTime());
}

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function getDaysInMonth(date: Date): number {
  return endOfMonth(date).getDate();
}

export function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

export function getFirstDayOfMonth(date: Date): Date {
  return startOfMonth(date);
}

export function getLastDayOfMonth(date: Date): Date {
  return endOfMonth(date);
}

// Default => 0 = Sunday. Assuming Sunday as the first day of the week... Adjust for locale-specific first day of week
export function getFirstDayOfWeek(date: Date, firstDayOfWeekIndex: number = 0): Date {
  const firstDay = new Date(date);
  const day = firstDay.getDay();
  if (day === firstDayOfWeekIndex) {
    return firstDay; // Already the first day of the week
  }
  // Calculate the difference to the first day of the week
  const diff = (day === 0 ? -6 : day - firstDayOfWeekIndex);
  firstDay.setDate(firstDay.getDate() - diff);
  return firstDay;
}

// Default => 6 = Saturday. Assuming Saturday as the last day of the week... Adjust for locale-specific first day of week
export function getLastDayOfWeek(date: Date, lastDayOfWeekIndex: number = 6): Date {
  const lastDay = new Date(date);
  const day = lastDay.getDay();
  if (day === lastDayOfWeekIndex) {
    return lastDay; // Already the last day of the week
  }
  // Calculate the difference to the last day of the week
  const diff = (lastDayOfWeekIndex === 0 ? 6 : lastDayOfWeekIndex - day);
  lastDay.setDate(lastDay.getDate() + diff);
  return lastDay;
}

export function getDaysOfWeek(locale: string = 'en-US'): string[] {
  const date = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
    return day.toLocaleDateString(locale, { weekday: 'long' });
  });
}

export function getMonths(locale: string = 'en-US'): string[] {
  const date = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(date.getFullYear(), i, 1);
    return month.toLocaleDateString(locale, { month: 'long' });
  });
}

export function getYears(startYear: number, endYear: number): number[] {
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

export function getDateDiffInMinutes(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60));
}

export function getDateDiffInHours(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

export function getDateDiffInDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDateDiffInMonths(startDate: Date, endDate: Date): number {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
}

export function getDateDiffInYears(startDate: Date, endDate: Date): number {
  return endDate.getFullYear() - startDate.getFullYear();
}

export function isTimeWithinRange(targetTime: number, startTime: number, endTime: number) {
  return startTime >= targetTime && targetTime <= endTime;
}

export function isDateWithinRange(targetDate: Date, startDate: Date, endDate: Date) {
  const targetTime = targetDate.getTime();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  return isTimeWithinRange(targetTime, startTime, endTime);
}
