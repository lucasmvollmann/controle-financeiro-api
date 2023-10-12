export function getLastDayOfMonth(month: number, year: number) {
  return new Date(year, month, 0);
}

export function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1);
}
