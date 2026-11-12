export type ReservationFields = { date: string; time: string; guests: string; name: string; phone: string };
export type ReservationErrors = Partial<Record<keyof ReservationFields, string>>;

export const reservationTimes = Array.from({ length: 27 }, (_, index) => `${String(8 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`);

export function addisNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const part = (type: string) => parts.find(value => value.type === type)?.value ?? '';
  return { date: `${part('year')}-${part('month')}-${part('day')}`, time: `${part('hour')}:${part('minute')}` };
}

export function validPhone(value: string) {
  const phone = value.trim().replace(/[\s().-]/g, '');
  if (/^(?:\+251|00251|251)/.test(phone)) return /^(?:\+251|00251|251)[79]\d{8}$/.test(phone);
  if (phone.startsWith('0')) return /^0[79]\d{8}$/.test(phone);
  return /^\+?[1-9]\d{6,14}$/.test(phone);
}

export function validateReservation(fields: ReservationFields, now = addisNow()): ReservationErrors {
  const errors: ReservationErrors = {};
  const date = new Date(`${fields.date}T12:00:00Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(fields.date) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === fields.date;
  if (!validDate) errors.date = 'Choose a date for your visit.';
  else if (fields.date < now.date) errors.date = 'Choose today or a future date.';
  if (!reservationTimes.includes(fields.time)) errors.time = 'Choose a time between 08:00 and 21:00.';
  else if (fields.date === now.date && fields.time <= now.time) errors.time = 'That time has passed. Choose a later time or another date.';
  if (!/^[1-8]$/.test(fields.guests)) errors.guests = 'Choose between 1 and 8 guests.';
  if (fields.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!validPhone(fields.phone)) errors.phone = 'Use a valid 09… or 07… number, or include a country code.';
  return errors;
}
