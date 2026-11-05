export const viewHashes={explore:'#events-view',openings:'#new-openings',past:'#past'};
export function viewFromHash(hash){
  if(hash==='#new-tables')return 'openings';
  return Object.keys(viewHashes).find(view=>viewHashes[view]===hash)||'explore';
}
export const periodFromHash=hash=>hash==='#this-week'?'week':'all';
