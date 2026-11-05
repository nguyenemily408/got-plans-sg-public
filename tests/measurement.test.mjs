import assert from 'node:assert/strict';
import {prepareMeasurement} from '../app/measurement.mjs';

const event={type:'pageview', url:'https://got-plans-sg.vercel.app/?event=pokemon&search=private-text#events-view'};
assert.deepEqual(prepareMeasurement(event),{type:'pageview',url:'https://got-plans-sg.vercel.app/'});
assert(event.url.includes('private-text'),'Do not mutate the original event');
for (const url of ['http://127.0.0.1:4174/','http://localhost:3000/','https://got-plans-preview.vercel.app/','https://got-plans-sg.vercel.app.example.com/','invalid']) {
  assert.equal(prepareMeasurement({type:'vital',url}),null,'Exclude local, preview and unrelated hosts');
}
assert.equal(prepareMeasurement({type:'vital',url:'https://got-plans-sg.vercel.app/?private=1'}).url,'https://got-plans-sg.vercel.app/');
console.log('Passed production-only measurements and query/hash redaction for visitor and speed tracking.');
