export function generateTimeOptions(stepMinutes = 15): string[] {
  const count = (24 * 60) / stepMinutes;
  return Array.from({ length: count }, (_, i) => {
    const totalMinutes = i * stepMinutes;
    const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const m = String(totalMinutes % 60).padStart(2, '0');
    return `${h}:${m}`;
  });
}

export const TIME_OPTIONS = generateTimeOptions(15);

export function formatHHmmTo12h(hhmm: string): string {
  const [hours, minutes] = hhmm.split(':');
  const hour = Number(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
