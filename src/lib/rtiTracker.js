import { COMMONS_SEED } from '../data/commons-seed.js';

const STORAGE_KEY = 'haq-ittila-filings';

function pad(n, len = 4) {
  return String(n).padStart(len, '0');
}

export function generateTrackingId() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  const num = pad(Math.floor(Math.random() * 9000) + 1000);
  return `KP-RTI-${year}-${suffix}${num}`.slice(0, 18);
}

export function saveFilingRecord(record) {
  const existing = getLocalRecords();
  existing.push(record);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (_) {}
}

function getLocalRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

export function getFilingById(id) {
  const local = getLocalRecords().find(r => r.id === id);
  if (local) return local;
  return COMMONS_SEED.find(r => r.id === id) || null;
}

export function getAllLocalAndSeededRecords() {
  const local = getLocalRecords();
  const localIds = new Set(local.map(r => r.id));
  const seeded = COMMONS_SEED.filter(r => !localIds.has(r.id));
  return [...local, ...seeded].sort((a, b) => b.filedDate.localeCompare(a.filedDate));
}

// Demo utility: returns a copy of the record with filedDate shifted back by `days`
// so the DeadlineTimer shows the correct green/amber/rust state.
export function simulateDaysPassed(record, days) {
  if (!record) return null;
  const d = new Date(record.filedDate);
  d.setDate(d.getDate() - days);
  return { ...record, filedDate: d.toISOString().slice(0, 10) };
}
