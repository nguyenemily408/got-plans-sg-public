import assert from 'node:assert/strict';
import {viewHashes,viewFromHash,periodFromHash} from '../app/navigation.mjs';
for(const [view,hash] of Object.entries(viewHashes))assert.equal(viewFromHash(hash),view);
assert.equal(viewFromHash('#new-tables'),'openings','Preserve the old dining-section link');
assert.equal(viewFromHash(''),'explore');
assert.equal(viewFromHash('#unrecognised'),'explore');
assert.equal(viewFromHash('#upcoming'),'explore');
assert.equal(periodFromHash('#upcoming'),'all');
assert.equal(periodFromHash('#events-view'),'all');
console.log('Passed three destinations, all-upcoming default and legacy Upcoming/New tables links.');

assert.equal(periodFromHash('#this-week'),'week');
