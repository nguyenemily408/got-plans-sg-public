'use client';

import {useEffect, useState} from 'react';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {LIVE_HOST, prepareMeasurement} from './measurement.mjs';

export default function Monitoring() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(window.location.protocol === 'https:' && window.location.hostname === LIVE_HOST);
  }, []);
  if (!live) return null;
  return <>
    <Analytics mode="production" debug={false} beforeSend={prepareMeasurement}/>
    <SpeedInsights debug={false} beforeSend={prepareMeasurement}/>
  </>;
}
