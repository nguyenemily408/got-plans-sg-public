import {visibleOpenings} from '../app/openings.mjs';

const fields = ['id','name','kind','cuisine','area','address','openingDate','openingLabel','status','description','hours','price','url','menuUrl','lastVerified'];
export function publicRestaurants(data, now = new Date()) {
  return {lastUpdated:data.lastUpdated, restaurants:visibleOpenings(data.restaurants, now).map(item => ({
    ...Object.fromEntries(fields.filter(key => item[key] !== undefined).map(key => [key,item[key]])),
    ...(item.image ? {image:Object.fromEntries(['src','alt','width','height','sourceUrl','credit'].filter(key=>item.image[key]!==undefined).map(key=>[key,item.image[key]]))} : {})
  }))};
}
