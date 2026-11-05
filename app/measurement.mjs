// Only the live website contributes to the owner's traffic dashboard.
export const LIVE_HOST = 'got-plans-sg.vercel.app';

export function prepareMeasurement(event) {
  try {
    const url = new URL(event.url);
    if (url.protocol !== 'https:' || url.hostname !== LIVE_HOST) return null;
    url.search = '';
    url.hash = '';
    return {...event, url: url.href};
  } catch {
    return null;
  }
}
