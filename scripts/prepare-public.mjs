import {mkdir,copyFile,rm,readFile,writeFile} from 'node:fs/promises';
import {publicCollection,ownerReview} from './public-data.mjs';
import sharp from 'sharp';
import {publicRestaurants} from './restaurant-data.mjs';
await mkdir('public',{recursive:true});
const data=JSON.parse(await readFile('dist/events.json','utf8')),sources=JSON.parse(await readFile('dist/sources.json','utf8'));
const published=publicCollection(data);
const restaurants=publicRestaurants(JSON.parse(await readFile('dist/restaurants.json','utf8')));
await rm('public/sources.json',{force:true});
let notes='';try{notes=(await readFile('OWNER-REVIEW.md','utf8')).split('<!-- owner-notes -->')[1]?.split('## Your notes')[1]||''}catch{}
await writeFile('OWNER-REVIEW.md',ownerReview(data,sources)+notes);
await copyFile('dist/lifecycle.mjs','public/lifecycle.mjs');
await rm('public/event-photos',{recursive:true,force:true});
await mkdir('public/event-photos',{recursive:true});
const responsivePhotos=new Map();
for(const path of new Set([...published.events,...restaurants.restaurants].map(event=>event.image?.src).filter(Boolean))){
 const source='dist'+path;
 await copyFile(source,'public'+path);
 const metadata=await sharp(source).metadata();
 const sourceWidth=[5,6,7,8].includes(metadata.orientation)?metadata.height:metadata.width;
 const widths=[...new Set([Math.min(320,sourceWidth),Math.min(640,sourceWidth)])];
 const variants=await Promise.all(widths.map(async width=>{
  const src=path.replace(/\.[^.]+$/,'.'+width+'.webp');
  const info=await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:78}).toFile('public'+src);
  return src+' '+info.width+'w';
 }));
 responsivePhotos.set(path,variants.join(', '));
}
for(const event of [...published.events,...restaurants.restaurants])if(event.image?.src)event.image={...event.image,srcSet:responsivePhotos.get(event.image.src)};
await writeFile('public/events.json',JSON.stringify(published,null,2)+'\n');
await writeFile('public/restaurants.json',JSON.stringify(restaurants,null,2)+'\n');
