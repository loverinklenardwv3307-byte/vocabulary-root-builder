/** Local calendar-day helpers. Keys are YYYY-MM-DD in the device's local calendar. */

function pad(value: number): string {
  return value < 10 ? '0' + value : String(value);
}

export function dateKey(date: Date): string {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

export function todayKey(): string {
  return dateKey(new Date());
}

/** The seven keys ending with today, oldest first. */
export function lastSevenKeys(): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    keys.push(dateKey(day));
  }
  return keys;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function shortDayLabel(key: string): string {
  const parts = key.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return DAY_LABELS[date.getDay()];
}

/** Whole calendar days between two keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const pa = a.split('-');
  const pb = b.split('-');
  const da = new Date(Number(pa[0]), Number(pa[1]) - 1, Number(pa[2]));
  const db = new Date(Number(pb[0]), Number(pb[1]) - 1, Number(pb[2]));
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}
