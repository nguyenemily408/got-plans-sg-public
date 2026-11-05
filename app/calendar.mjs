import {shiftDate} from '../dist/lifecycle.mjs';
const escapeText=value=>String(value||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
function fold(line){let result='',part='',length=0;for(const char of line){const bytes=new TextEncoder().encode(char).length;if(length+bytes>74){result+=part+'\r\n ';part='';length=1}part+=char;length+=bytes}return result+part}
export function calendarEntry(event,selectedDay,now=new Date()){
 const dates=[...event.dates].sort();
 const day=dates.includes(selectedDay)?selectedDay:dates.filter(day=>day<selectedDay).at(-1)||dates[0];
 const time=event.calendarTime,dateOnly=!time?.start||!time?.end;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Got Plans SG//Event reminder//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+escapeText(event.id+'-'+day+'@got-plans.sg'),'DTSTAMP:'+stamp(now)];
 if(dateOnly){lines.push('DTSTART;VALUE=DATE:'+day.replace(/-/g,''),'DTEND;VALUE=DATE:'+shiftDate(day,1).replace(/-/g,''))}
 else{
  const endDay=time.end<=time.start?shiftDate(day,1):day;
  lines.push('DTSTART:'+stamp(new Date(day+'T'+time.start+':00+08:00')),'DTEND:'+stamp(new Date(endDay+'T'+time.end+':00+08:00')));
 }
 lines.push('SUMMARY:'+escapeText(event.name+(dateOnly?' — date reminder':'')),'LOCATION:'+escapeText(event.place),'DESCRIPTION:'+escapeText([dateOnly?'Date reminder only; confirm individual session times.':'Times are in Singapore time. Check availability with the organiser.',event.when,event.price,...(event.attendance||[]),event.url].join('\n')),'URL:'+event.url,'END:VEVENT','END:VCALENDAR');
 return {content:lines.map(fold).join('\r\n')+'\r\n',dateOnly,day};
}
