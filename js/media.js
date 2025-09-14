import { KEYS } from './config.js';
import { cachedJSON } from './fetcher.js';

async function pexels(path){
  return cachedJSON(`https://api.pexels.com/${path}`, { init: { headers:{ Authorization: KEYS.PEXELS } } });
}
export async function getPoster(query="calm ocean at sunrise") {
  const j=await pexels(`v1/search?query=${encodeURIComponent(query)}&per_page=1`);
  return j?.photos?.[0]?.src?.large || null;
}
export async function getHeroClip(query="calm ocean loop") {
  const j=await pexels(`videos/search?query=${encodeURIComponent(query)}&per_page=1`);
  return j?.videos?.[0]?.video_files?.find(v=>v.quality==="sd" && v.file_type==="video/mp4")?.link || null;
}

