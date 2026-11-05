'use client';

import {useEffect, useState} from 'react';
import {visibleOpenings} from './openings.mjs';
import {Icon,Graphic} from './card-media';

const officialUrl = value => {try {const url=new URL(value);return url.protocol==='https:'?url.href:'#'}catch{return '#'}};

function OpeningCard({item}) {
  const [detailsOpen,setDetailsOpen]=useState(false);
  const detailsId='opening-details-'+item.id;
  return <article className="card opening-card" aria-labelledby={'opening-'+item.id}>
    <Graphic event={item}/>
    <div className="body"><div className="event-heading">
      <div className="event-date-row"><span className="event-date"><Icon name="calendar" size={18}/>{item.openingLabel}</span></div>
      <div className="event-tags"><span className="category">{item.kind} · {item.cuisine}</span></div>
      <h3 id={'opening-'+item.id}><a href={officialUrl(item.url)} target="_blank" rel="noopener noreferrer">{item.name}</a></h3>
    </div><div className="event-facts">
      <div className="detail"><Icon name="calendar"/><span>{item.hours}</span></div>
      <div className="detail"><Icon name="pin"/><span className="venue-full">{item.address}</span><span className="venue-short">{item.area}</span></div>
      <p className="price">{item.price}</p>
    </div></div>
    <div className="card-footer"><div className="event-actions">
      <button className="details-toggle" aria-expanded={detailsOpen} aria-controls={detailsId} onClick={()=>setDetailsOpen(!detailsOpen)}>Details<span className="sr-only"> about {item.name}</span><span aria-hidden="true">{detailsOpen?'−':'+'}</span></button>
      <a href={officialUrl(item.url)} target="_blank" rel="noopener noreferrer" aria-label={'Visit the official website for '+item.name}>Menu & details <Icon name="external" size={14}/></a>
    </div><div id={detailsId} className="event-description" hidden={!detailsOpen}><p className="description">{item.description}</p><p className="full-schedule"><strong>Address:</strong> {item.address}</p></div></div>
  </article>;
}

export default function NewOpenings() {
  const [data,setData]=useState(null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0),[kind,setKind]=useState('all'),[query,setQuery]=useState('');
  useEffect(()=>{
    let active=true;
    setError(false);
    fetch('/restaurants.json',{cache:'no-store'}).then(async response=>{
      if(!response.ok)throw Error('Openings unavailable');
      const next=await response.json();
      if(!Array.isArray(next.restaurants))throw Error('Invalid openings');
      if(active)setData(next);
    }).catch(()=>{if(active)setError(true)});
    return ()=>{active=false};
  },[attempt]);
  const reset=()=>{setKind('all');setQuery('')};
  const items=data?visibleOpenings(data.restaurants).filter(item=>(kind==='all'||item.kind===kind)&&[item.name,item.area,item.cuisine,item.address,item.description].join(' ').toLowerCase().includes(query.trim().toLowerCase())):[];
  return <section id="new-openings" className="openings-page" aria-labelledby="new-openings-title">
    <div className="section-head"><div><h1 id="new-openings-title" className="page-title">New restaurants, cafés & bars</h1><p className="subtle">Recently opened and opening soon in Singapore.</p></div><label className="search"><Icon name="search" size={20}/><input type="search" placeholder="Search openings or places" aria-label="Search openings or places" value={query} onChange={event=>setQuery(event.target.value)}/></label></div>
    <div className="plan-shortcuts opening-filters" role="group" aria-label="Opening type">{[['all','All'],['Restaurant','Restaurants'],['Café','Cafés'],['Bar','Bars']].map(([value,label])=><button key={value} className="chip" aria-pressed={kind===value} onClick={()=>setKind(value)}>{label}</button>)}</div>
    {data&&!error&&<div className="resultbar"><span role="status" aria-live="polite">{items.length} {items.length===1?'opening':'openings'}{kind==='all'?' to explore':' in '+{Restaurant:'restaurants','Café':'cafés',Bar:'bars'}[kind]}</span><button className="reset" onClick={reset}>Reset filters</button></div>}
    {error?<div className="empty" role="alert"><h2>New openings couldn’t load.</h2><p>Try again, or use Events to find things to do.</p><button className="chip" onClick={()=>setAttempt(value=>value+1)}>Try openings again</button></div>:!data?<p role="status">Finding your next dinner spot…</p>:!items.length?<div className="empty"><h2>{query.trim()?'No openings match your search.':'No '+(kind==='all'?'recent openings':{Restaurant:'new restaurants','Café':'new cafés',Bar:'new bars'}[kind])+' added yet.'}</h2><p>Try another search or type, or check back after the next refresh.</p><button className="chip" onClick={reset}>Show all openings</button></div>:<div className="grid layout-magazine">{items.map(item=><OpeningCard key={item.id} item={item}/>)}</div>}
    <aside className="note"><Icon name="info" size={20}/><div><strong>Before you book a table.</strong> S$ means Singapore dollars; “++” means service charge and GST are added. Opening dates and hours can change. Check the restaurant’s latest details before travelling; reservations and availability aren’t guaranteed.</div></aside>
  </section>;
}
