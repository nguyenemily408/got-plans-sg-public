export const ZONE='Asia/Singapore';
export function singaporeDate(now=new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function shiftDate(day,amount){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+amount);return d.toISOString().slice(0,10)}
export function weekBounds(now=new Date()){const today=singaporeDate(now),weekday=new Date(today+'T12:00:00Z').getUTCDay();const start=shiftDate(today,-((weekday+6)%7));return {start,end:shiftDate(start,6),today}}
export function eventEnd(event){return event.endAt?new Date(event.endAt):new Date([...event.dates].sort().at(-1)+'T23:59:59.999+08:00')}
export function isPast(event,now=new Date()){return eventEnd(event).getTime()<=now.getTime()}
export function eventLastDay(event){return singaporeDate(new Date(eventEnd(event).getTime()-1))}
export function eventDates(event){
 const dates=[...event.dates].sort(),last=dates.at(-1),end=eventLastDay(event);
 if(event.endAt)for(let day=shiftDate(last,1);day<=end;day=shiftDate(day,1))dates.push(day);
 return dates;
}
export function inWeek(event,now=new Date()){const {start,end}=weekBounds(now);return !isPast(event,now)&&eventDates(event).some(d=>d>=start&&d<=end)}
export function nextDate(event,now=new Date()){const today=singaporeDate(now);return eventDates(event).find(d=>d>=today)||[...event.dates].sort().at(-1)}
export function formatDate(day,options={day:'numeric',month:'short'}){return new Intl.DateTimeFormat('en-SG',{timeZone:ZONE,...options}).format(new Date(day+'T12:00:00+08:00'))}
