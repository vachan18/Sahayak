/**
 * "Remind me" — downloads a standard .ics calendar event.
 * Works with the phone's built-in calendar (Google Calendar, Samsung, iOS) with no account or server.
 */
export function downloadReminder({ title, description, date, durationMinutes = 30 }: { title: string; description?: string; date: Date; durationMinutes?: number }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(date.getTime() + durationMinutes * 60000);
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sahayak//Welfare reminders//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@sahayak`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(date)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(title)}`,
    description ? `DESCRIPTION:${esc(description)}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^\w\d]+/g, '-').slice(0, 40) || 'sahayak-reminder'}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
