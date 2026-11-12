'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Check, Clock3, Mail, Users } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styles from './InteractiveSections.module.scss';

type Fields = { name: string; email: string; date: string; time: string; guests: string };
type Errors = Partial<Record<keyof Fields, string>>;
const timeOptions = Array.from({ length: 27 }, (_, index) => `${String(8 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`);
function addisNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? '';
  return { date: `${part('year')}-${part('month')}-${part('day')}`, time: `${part('hour')}:${part('minute')}` };
}

export default function Reservation() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', date: '', time: '18:00', guests: '2' });
  const [minimumDate, setMinimumDate] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => { setMinimumDate(addisNow().date); }, []);
  useEffect(() => { if (submitted) successRef.current?.focus(); }, [submitted]);
  function update(field: keyof Fields, value: string) { setFields((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = addisNow();
    setMinimumDate(now.date);
    const nextErrors: Errors = {};
    if (fields.name.trim().length < 2) nextErrors.name = 'Please enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!fields.date || !/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) nextErrors.date = 'Choose a date for your visit.';
    else if (fields.date < now.date) nextErrors.date = 'Choose today or a future date.';
    if (!timeOptions.includes(fields.time)) nextErrors.time = 'Choose a time between 08:00 and 21:00.';
    else if (fields.date === now.date && fields.time <= now.time) nextErrors.time = 'That time has passed. Choose a later time or another date.';
    if (!/^[1-8]$/.test(fields.guests)) nextErrors.guests = 'Choose between 1 and 8 guests.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitted(true);
  }
  const error = (field: keyof Fields) => errors[field] ? <span id={`reservation-${field}-error`} className={styles.fieldError}>{errors[field]}</span> : null;

  return (
    <section className={styles.reservation} id="reservation" aria-labelledby="reservation-heading">
      <div className={`container ${styles.reservationLayout}`}>
        <div className={styles.reservationCopy}>
          <p className="eyebrow">THERE’S A PLACE FOR YOU HERE</p>
          <h2 className="section-heading" id="reservation-heading">Your next good<br />memory <em>starts here.</em></h2>
          <p>Bring your favorite people. We’ll bring the warmth,<br className={styles.desktopBreak} /> the flavor, and a reason to stay a little longer.</p>
          <div className={styles.reservationDetail}><div className={styles.reservationPhoto}><Image src="/images/interior/date.jpg" alt="An intimate table setting in a warmly lit restaurant" fill sizes="82px" /></div><div><span>A TABLE. A CONVERSATION. A MOMENT.</span><p>Make room for something lovely.</p></div></div>
        </div>
        <div className={styles.reservationPanel}>
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? <motion.div key="success" className={styles.success} ref={successRef} tabIndex={-1} role="status" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className={styles.successIcon}><Check size={29} /></span><p className="eyebrow">YOUR PREVIEW IS READY</p><h3>Good plans,<br /><em>{fields.name.trim().split(' ')[0]}.</em></h3>
              <p>A table for {fields.guests} on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(`${fields.date}T12:00:00`))} at {fields.time}.</p>
              <p className={styles.previewNotice}>This is a reservation preview. No booking or email has been sent.</p>
              <button type="button" className="button" onClick={() => { setSubmitted(false); setErrors({}); }}>Plan another visit <ArrowUpRight size={17} /></button>
            </motion.div> : <motion.form key="form" ref={formRef} onSubmit={submit} noValidate initial={false} animate={{ opacity: 1 }} className={styles.reservationForm}>
              <div className={styles.formHeading}><h3>Save your favorite seat.</h3><span>01 — THE GOOD PLAN</span></div>
              <div className={styles.formGrid}>
                <div className={styles.formField}><label htmlFor="reservation-name">Your name</label><input id="reservation-name" name="name" value={fields.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" placeholder="How shall we call you?" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'reservation-name-error' : undefined} />{error('name')}</div>
                <div className={styles.formField}><label htmlFor="reservation-email">Email address</label><div className={styles.inputIcon}><Mail size={16} aria-hidden="true" /><input id="reservation-email" name="email" type="email" value={fields.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" placeholder="you@example.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'reservation-email-error' : undefined} /></div>{error('email')}</div>
                <div className={styles.formField}><label htmlFor="reservation-date">Pick a day</label><div className={styles.inputIcon}><CalendarDays size={16} aria-hidden="true" /><input id="reservation-date" name="date" type="date" min={minimumDate || undefined} value={fields.date} onChange={(event) => update('date', event.target.value)} required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'reservation-date-error' : undefined} /></div>{error('date')}</div>
                <div className={styles.formField}><label htmlFor="reservation-time">Pick a time <small>(Addis Ababa)</small></label><div className={styles.inputIcon}><Clock3 size={16} aria-hidden="true" /><select id="reservation-time" name="time" value={fields.time} onChange={(event) => update('time', event.target.value)} required aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'reservation-time-error' : undefined}>{timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}</select></div>{error('time')}</div>
                <div className={`${styles.formField} ${styles.guestField}`}><label htmlFor="reservation-guests">Your company</label><div className={styles.inputIcon}><Users size={16} aria-hidden="true" /><select id="reservation-guests" name="guests" value={fields.guests} onChange={(event) => update('guests', event.target.value)} required aria-invalid={Boolean(errors.guests)} aria-describedby={errors.guests ? 'reservation-guests-error' : undefined}>{Array.from({ length: 8 }, (_, index) => <option value={index + 1} key={index}>{index + 1} {index === 0 ? 'guest' : 'guests'}</option>)}</select></div>{error('guests')}</div>
              </div>
              <button type="submit" className={`button ${styles.submitButton}`}>Let’s make a date <ArrowUpRight size={20} aria-hidden="true" /></button>
              <p className={styles.formDisclaimer}>Reservation preview · no booking is sent</p>
            </motion.form>}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
