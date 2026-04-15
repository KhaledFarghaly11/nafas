import type { Schedule } from '@/types';

export const SCHEDULE_SEEDS: Schedule[] = [
  {
    kitchenId: 'kitchen-1',
    days: [
      { day: 'sat', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'sun', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'mon', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'tue', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'wed', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'thu', isOpen: false, openTime: null, closeTime: null },
      { day: 'fri', isOpen: true, openTime: '10:00', closeTime: '22:00' },
    ],
  },
  {
    kitchenId: 'kitchen-2',
    days: [
      { day: 'sat', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'sun', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'mon', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'tue', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'wed', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'thu', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'fri', isOpen: false, openTime: null, closeTime: null },
    ],
  },
  {
    kitchenId: 'kitchen-3',
    days: [
      { day: 'sat', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'sun', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'mon', isOpen: false, openTime: null, closeTime: null },
      { day: 'tue', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'wed', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'thu', isOpen: true, openTime: '09:00', closeTime: '22:00' },
      { day: 'fri', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    ],
  },
  {
    kitchenId: 'kitchen-4',
    days: [
      { day: 'sat', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'sun', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'mon', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'tue', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'wed', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'thu', isOpen: true, openTime: '07:00', closeTime: '16:00' },
      { day: 'fri', isOpen: false, openTime: null, closeTime: null },
    ],
  },
  {
    kitchenId: 'kitchen-5',
    days: [
      { day: 'sat', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'sun', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'mon', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'tue', isOpen: false, openTime: null, closeTime: null },
      { day: 'wed', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'thu', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'fri', isOpen: true, openTime: '10:00', closeTime: '22:00' },
    ],
  },
  {
    kitchenId: 'kitchen-6',
    days: [
      { day: 'sat', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'sun', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'mon', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'tue', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'wed', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'thu', isOpen: true, openTime: '06:00', closeTime: '20:00' },
      { day: 'fri', isOpen: false, openTime: null, closeTime: null },
    ],
  },
];
