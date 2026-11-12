'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Check, Clock3, Phone, Users } from 'lucide-react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { site } from '@/data/site';
import { addisNow, reservationTimes, validateReservation, type ReservationErrors, type ReservationFields } from '@/lib/reservations';
import styles from './InteractiveSections.module.scss';

export default function Reservation() {
  const [fields, setFields] = useState<ReservationFields>({ date: '', time: '18:00', guests: '2', name: '', phone: '' });
  const [minimumDate, setMinimumDate] = useState('');
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => { setMinimumDate(addisNow().date); }, []);
  useEffect(() => { if (submitted) successRef.current?.focus(); }, [submitted]);

  function update(field: keyof ReservationFields, value: string) {
    setFields(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = addisNow();
    setMinimumDate(now.date);
    const nextErrors = validateReservation(fields, now);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitted(true);
  }

  const error = (field: keyof ReservationFields) => errors[field] ? <span id={`reservation-${field}-error`} className={styles.fieldError}>{errors[field]}</span> : null;

  return (
    <section className={styles.reservation} id="reservation" aria-labelledby="reservation-heading">
      <div className={`container ${styles.reservationLayout}`}>
        <div className={styles.reservationCopy}>
          <p className="eyebrow">TABLES FOR 1–8</p>
          <h2 className="section-heading" id="reservation-heading">Choose<br />your table.</h2>
          <p>Pick a date and time. Tell us how many.<br className={styles.desktopBreak} /> Preview the details before you visit.</p>
          <div className={styles.reservationDetail}>
            <div className={styles.reservationPhoto}><Image src="/images/interior/date.jpg" alt="Guests seated at a table with plated food and wine glasses" fill sizes="75px" /></div>
            <div><span>COFFEE FOR TWO. LUNCH FOR EIGHT.</span><p>Start with your date and guest count.</p></div>
          </div>
        </div>
        <div className={styles.reservationPanel}>
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div key="success" className={styles.success} ref={successRef} tabIndex={-1} role="status" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                <span className={styles.successIcon}><Check size={29} /></span>
                <p className="eyebrow">TABLE PLAN</p>
                <h3>Your table plan<br />is ready.</h3>
                <p>{fields.name.trim().split(' ')[0]}, your preview is for {fields.guests} on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(`${fields.date}T12:00:00`))} at {fields.time}.</p>
                <p className={styles.previewNotice}>No table is booked yet. Call us to confirm your date and time.</p>
                <div className={styles.successActions}>
                  <a className="button" href={site.phoneHref}><Phone size={19} aria-hidden="true" />Call to confirm</a>
                  <button type="button" className="button-outline" onClick={() => { setSubmitted(false); setErrors({}); }}>Change my table plan <ArrowUpRight size={17} /></button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" ref={formRef} onSubmit={submit} noValidate data-reservation-form initial={false} animate={{ opacity: 1 }} className={styles.reservationForm}>
                <div className={styles.formHeading}><h3>Plan a visit.</h3><span>DATE · TIME · GUESTS</span></div>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label htmlFor="reservation-date">Date</label>
                    <div className={styles.inputIcon}><CalendarDays size={18} aria-hidden="true" /><input id="reservation-date" name="date" type="date" min={minimumDate || undefined} value={fields.date} onChange={event => update('date', event.target.value)} required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'reservation-date-error' : undefined} /></div>
                    {error('date')}
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="reservation-time">Time <small>(Addis Ababa)</small></label>
                    <div className={styles.inputIcon}><Clock3 size={18} aria-hidden="true" /><select id="reservation-time" name="time" value={fields.time} onChange={event => update('time', event.target.value)} required aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'reservation-time-error' : undefined}>{reservationTimes.map(time => <option key={time} value={time}>{time}</option>)}</select></div>
                    {error('time')}
                  </div>
                  <div className={`${styles.formField} ${styles.guestField}`}>
                    <label htmlFor="reservation-guests">Guests</label>
                    <div className={styles.inputIcon}><Users size={18} aria-hidden="true" /><input id="reservation-guests" name="guests" type="number" inputMode="numeric" min={1} max={8} step={1} value={fields.guests} onChange={event => update('guests', event.target.value)} required aria-invalid={Boolean(errors.guests)} aria-describedby={errors.guests ? 'reservation-guests-error' : undefined} /></div>
                    {error('guests')}
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="reservation-name">Name</label>
                    <input id="reservation-name" name="name" value={fields.name} onChange={event => update('name', event.target.value)} autoComplete="name" placeholder="Full name" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'reservation-name-error' : undefined} />
                    {error('name')}
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="reservation-phone">Phone</label>
                    <div className={styles.inputIcon}><Phone size={18} aria-hidden="true" /><input id="reservation-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={fields.phone} onChange={event => update('phone', event.target.value)} placeholder="09… or +251…" maxLength={26} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'reservation-phone-error' : undefined} /></div>
                    {error('phone')}
                  </div>
                </div>
                <button type="submit" className={`button ${styles.submitButton}`}>Preview my table <ArrowUpRight size={20} aria-hidden="true" /></button>
                <p className={styles.formDisclaimer}>Preview only · no table is reserved</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
