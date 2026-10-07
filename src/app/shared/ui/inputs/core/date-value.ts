/** Parses date-only values without shifting their calendar day across time zones. */
export function parseDateInputValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value !== "string") return null;

  const normalizedValue = value.trim();
  if (!normalizedValue) return null;

  const dayMonthYear = normalizedValue.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  );
  if (dayMonthYear) {
    return createLocalDate(
      Number(dayMonthYear[3]),
      Number(dayMonthYear[2]),
      Number(dayMonthYear[1]),
    );
  }

  const isoDate = normalizedValue.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/,
  );
  if (isoDate) {
    return createLocalDate(
      Number(isoDate[1]),
      Number(isoDate[2]),
      Number(isoDate[3]),
    );
  }

  const fallback = new Date(normalizedValue);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function normalizeDateInputValue(value: unknown): unknown {
  if (value === null || value === undefined || value === "") return value;

  const date = parseDateInputValue(value);
  if (!date) return value;

  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDateInputValue(value: unknown): boolean {
  return value === null || value === undefined || value === ""
    ? true
    : parseDateInputValue(value) !== null;
}

function createLocalDate(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const utcDate = new Date(0);
  utcDate.setUTCFullYear(year, month - 1, day);
  utcDate.setUTCHours(0, 0, 0, 0);
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  const localDate = new Date(0);
  localDate.setFullYear(year, month - 1, day);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
}
