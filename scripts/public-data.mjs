import {isPast} from '../dist/lifecycle.mjs';
const eventFields=['id','name','category','when','place','price','desc','source','sourceType','url','lastVerified','dates','endAt','featured','discoveryExcluded','dateRangeOnly','graphic','color','ink','image','connectionType','publicCheckNote','area','entryCost','calendarTime','attendance'];
export function publicCollection(data,now=new Date()){
 return {lastUpdated:data.lastUpdated,events:data.events.filter(event=>isPast(event,now)||(!event.dateRangeOnly&&event.factCheck?.status!=='unverified')).map(event=>({...Object.fromEntries(eventFields.filter(key=>event[key]!==undefined).map(key=>[key,event[key]])),verificationStatus:event.factCheck?.status||'unverified'}))};
}
export function publicSources(sources){
 const source=s=>Object.fromEntries(['name','url','handle','kind'].filter(key=>s[key]!==undefined).map(key=>[key,s[key]]));
 return {instagram:sources.instagram.map(s=>({...source(s),description:s.description.split(/\.\s/)[0]+(s.description.endsWith('.')?'':'.')})),websites:sources.websites.map(s=>({...source(s),description:s.description.split(/\.\s/)[0]}))};
}
export function ownerReview(data,sources,now=new Date()){
 const pending=data.events.filter(e=>!isPast(e,now)&&(e.dateRangeOnly||e.factCheck?.status==='unverified'));
 const checks=data.events.filter(e=>e.factCheck?.status!=='confirmed'||e.entryCost?.kind==='unknown');
 return '# Private owner review — Got Plans? SG\n\nThis file is for local review in Codex. It is excluded from Git and deployment. The full permanent collection stays in dist/events.json. Publishing still requires your explicit instruction.\n\n## Withheld from the public collection\n\n'+pending.map(e=>'### '+e.name+'\n\n- ID: `'+e.id+'`\n- [Original announcement]('+e.url+')\n- Recorded check: '+e.lastVerified+'\n- Follow up: '+(e.factCheck?.note||'Confirm individual session dates and venue.')+'\n').join('\n')+'\n## Other details to check\n\n'+checks.filter(e=>!pending.includes(e)).map(e=>'- **'+e.name+'** — '+(e.factCheck?.note||'Entry price is not confirmed. Check the original listing.')+' [Source]('+e.url+')').join('\n')+'\n\n## Source research status\n\n'+[...sources.instagram,...sources.websites].map(s=>'- **'+s.name+'** — '+(s.status||'Saved source')+'. '+(s.statusNote||'')+' [Source]('+s.url+')').join('\n')+'\n\n<!-- owner-notes -->\n## Your notes\n\n';
}
