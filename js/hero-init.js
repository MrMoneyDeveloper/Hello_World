import { getPoster, getHeroClip } from './media.js';

async function initHero(){
  const posterEl = document.getElementById('poster');
  const heroEl = document.getElementById('hero');
  try{
    const [p,v] = await Promise.all([
      getPoster().catch(()=>null),
      getHeroClip().catch(()=>null)
    ]);
    const posterUrl = p || 'assets/climate_poster.jpg';
    const videoUrl  = v || 'assets/climate_hero.mp4';
    if (posterEl) posterEl.src = posterUrl;
    if (heroEl) {
      heroEl.src = videoUrl;
      heroEl.poster = posterUrl;
    }
  }catch{
    if (posterEl) posterEl.src = 'assets/climate_poster.jpg';
    if (heroEl) heroEl.src = 'assets/climate_hero.mp4';
  }
}

document.addEventListener('DOMContentLoaded', initHero);

