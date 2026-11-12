import { expect, test } from '@playwright/test';
import { addisNow, validPhone, validateReservation } from '@/lib/reservations';

const visit = { date: '2026-11-13', time: '18:00', guests: '2', name: 'Selam', phone: '0921282925' };
const now = { date: '2026-11-12', time: '19:30' };

test('date limits use the Addis Ababa calendar across UTC midnight', () => {
  expect(addisNow(new Date('2026-11-12T21:10:00Z'))).toEqual({ date: '2026-11-13', time: '00:10' });
});

test('phone validation accepts local and international forms and rejects incomplete numbers', () => {
  for (const phone of ['0921282925', '+251921282925', '00251921282925', '+1 202 555 0123']) expect(validPhone(phone), phone).toBe(true);
  for (const phone of ['0921', '+2510921282925', '092128292', 'not a phone']) expect(validPhone(phone), phone).toBe(false);
});

test('impossible dates and times already passed are rejected', () => {
  expect(validateReservation({ ...visit, date: '2026-02-31' }, now).date).toBeDefined();
  expect(validateReservation({ ...visit, date: '2026-11-11' }, now).date).toBeDefined();
  expect(validateReservation({ ...visit, date: now.date, time: '19:00' }, now).time).toBeDefined();
});

test('party-size boundaries are enforced and a complete future visit is valid', () => {
  for (const guests of ['0', '9', '2.5']) expect(validateReservation({ ...visit, guests }, now).guests).toBeDefined();
  expect(validateReservation(visit, now)).toEqual({});
});
