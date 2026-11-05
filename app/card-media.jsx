'use client';

import {useState} from 'react';
const safeUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:'#'}catch{return '#'}};

export function Icon({name,size=18,...props}){
 const paths={search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/></>,pin:<><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,external:<><path d="M14 3h7v7m0-7L10 14"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></>,arrow:<path d="M5 5l14 14m0-10v10H9"/>,spark:<path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6m0-15.6L4.2 19.8"/>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
export function Graphic({event}){
 const [failed,setFailed]=useState(false);
 const photo=event.image,hasPhoto=!!photo&&!failed;
 return <><div className={'visual'+(hasPhoto?' has-photo':'')} style={{background:event.color,color:event.ink}}>{hasPhoto?<a className="source-photo" href={safeUrl(event.url)} target="_blank" rel="noopener noreferrer" aria-label={`View original listing for ${event.name}`}><picture>{photo.srcSet&&<source type="image/webp" srcSet={photo.srcSet} sizes="(max-width: 650px) 74px, 210px"/>}<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{objectFit:photo.fit||'cover',objectPosition:photo.position||'center'}} onError={()=>setFailed(true)}/></picture></a>:<><span className="big">{(event.graphic||'Photo unavailable').split('<br>').map((part,i)=><span key={i}>{i>0&&<br/>}{part}</span>)}</span></>}</div></>;
}
