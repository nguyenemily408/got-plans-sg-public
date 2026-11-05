import {singaporeDate, shiftDate} from '../dist/lifecycle.mjs';

export function visibleOpenings(items, now = new Date()) {
  const today = singaporeDate(now);
  return items.filter(item => item.factCheck?.status !== 'unverified' && item.status !== 'closed' && item.openingDate >= shiftDate(today, -60) && item.openingDate <= shiftDate(today, 30))
    .sort((a, b) => b.openingDate.localeCompare(a.openingDate));
}
