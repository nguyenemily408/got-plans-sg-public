import {eventDates,isPast,singaporeDate,shiftDate,weekBounds,nextDate} from '../dist/lifecycle.mjs';

export function matchesPeriod(event,period,now=new Date()){
 if(period==='all')return true;
 if(isPast(event,now))return false;
 const today=singaporeDate(now);
 const bounds=weekBounds(now);
 const days=period==='today'?[today]:period==='week'?Array.from({length:7},(_,index)=>shiftDate(bounds.start,index)).filter(day=>day>=today):[shiftDate(bounds.start,5),shiftDate(bounds.start,6)].filter(day=>day>=today);
 return eventDates(event).some(day=>days.includes(day));
}
export function participationNotes(event){
 const text=[event.desc,event.price].join(' '),notes=[];
 const age=text.match(/ages?\s+(\d+\s*[–-]\s*\d+)/i);
 if(age)notes.push('Ages '+age[1]);
 if(/individuals and groups/i.test(text))notes.push('Individuals & groups welcome');
 if(/registration required|registration closes/i.test(text))notes.push('Registration required');
 else if(/RSVP required|RSVP with the organiser/i.test(text))notes.push('RSVP required');
 if(/ticket holders only/i.test(text))notes.push('Ticket holders only');
 if(/members? only|membership required/i.test(text))notes.push('Membership required');
 return [...new Set([...notes,...(event.attendance||[])])];
}

// Unconfirmed sessions stay in the private owner review queue.
export function needsChecking(event){return event.dateRangeOnly===true||(event.factCheck?.status||event.verificationStatus)==='unverified'}
export function planType(event){return event.connectionType==='meet-people'?'meet':'activity'}
export function occurrenceDate(event,selectedDay='all',period='all',now=new Date()){
 const dates=eventDates(event);
 if(selectedDay!=='all'&&dates.includes(selectedDay))return selectedDay;
 if(period==='today'&&dates.includes(singaporeDate(now)))return singaporeDate(now);
 if(period==='weekend'){
  const bounds=weekBounds(now),days=[shiftDate(bounds.start,5),shiftDate(bounds.start,6)];
  const match=dates.find(day=>days.includes(day)&&day>=bounds.today);
  if(match)return match;
 }
 return nextDate(event,now);
}

export function matchesCost(event,filter='all'){
 const cost=event.entryCost||{kind:'unknown'};
 if(filter==='all')return true;
 if(filter==='free')return cost.kind==='free';
 if(filter==='over20')return cost.kind==='paid'&&Number.isFinite(cost.from)&&cost.from>20;
 if(filter==='low')return ['free','paid'].includes(cost.kind)&&Number.isFinite(cost.from)&&cost.from<=20;
 return cost.kind===filter;
}

// Dates stay in the card heading; retain the original schedule inside Details.
export function eventTime(event,occurrence){
 if(occurrence&&!event.dates.includes(occurrence)&&event.calendarTime?.end)return 'Until '+event.calendarTime.end+' · continues from the previous day';
 const schedule=event.when||'Check original listing for times';
 const divider=schedule.indexOf(' · ');
 return divider<0?schedule:schedule.slice(divider+3);
}

// Use the existing confirmed description, without inferring solo admission or hosts.
export function socialContext(event){
 if(planType(event)!=='meet'||(event.verificationStatus||event.factCheck?.status)!=='confirmed')return null;
 const format=event.desc?.split(/\.\s/)[0];
 if(!format)return null;
 const welcomesIndividuals=/individuals and groups/i.test(format);
 return {format:welcomesIndividuals?'Individuals & groups welcome.':format.replace(/\.$/,'')+'.',askSolo:!welcomesIndividuals};
}

export const priceFilters=[['all','Any entry price'],['free','Free entry'],['low','Up to S$20 (includes free)'],['over20','Over S$20'],['mixed','Free & paid activities'],['unknown','Price not confirmed']];
// Offer real listed dates only, while respecting the current date filter.
export function matchingDates(event,selectedDay='all',period='all',now=new Date()) {
 const dates=eventDates(event);
 if(isPast(event,now))return dates;
 const {today,start,end}=weekBounds(now);
 return dates.filter(day=>day>=today&&(selectedDay==='all'||day===selectedDay)&&
  (period==='all'||period==='today'&&day===today||period==='week'&&day>=start&&day<=end||period==='weekend'&&[shiftDate(start,5),shiftDate(start,6)].includes(day)));
}
