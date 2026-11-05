import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {visibleOpenings} from '../app/openings.mjs';
import {publicRestaurants} from '../scripts/restaurant-data.mjs';
const now=new Date('2026-11-05T12:00:00+08:00');
const data=JSON.parse(readFileSync('dist/restaurants.json'));
assert.equal(new Set(data.restaurants.map(item=>item.id)).size,data.restaurants.length);
for(const item of data.restaurants){
  for(const field of ['name','cuisine','area','address','openingDate','openingLabel','hours','price','url','lastVerified'])assert(item[field],item.id+' missing '+field);
  assert.equal(new URL(item.url).protocol,'https:');
  assert(!('dates' in item),'Restaurants must not become daily calendar events');
  assert(existsSync('dist'+item.image.src));
  assert.equal(item.image.sourceUrl,item.url);
}
const base={...data.restaurants[0],factCheck:{status:'confirmed',note:'PRIVATE_SENTINEL'}};
const examples=[base,{...base,id:'old',openingDate:'2026-08-01'},{...base,id:'unverified',factCheck:{status:'unverified'}},{...base,id:'closed',status:'closed'},{...base,id:'far-future',openingDate:'2027-01-01'}];
assert.deepEqual(visibleOpenings(examples,now).map(item=>item.id),[base.id]);
const published=publicRestaurants({lastUpdated:data.lastUpdated,restaurants:[{...base,research:'PRIVATE_SENTINEL'}]},now);
assert(!JSON.stringify(published).includes('PRIVATE_SENTINEL'));
assert(!('assetUrl' in published.restaurants[0].image));
assert.equal(data.restaurants.find(item=>item.id.includes('greenwood')).status,'announced','A passed announced date does not prove the restaurant is trading');
console.log('Passed restaurant separation, recency, announced-opening honesty, source images and private research exclusion.');
