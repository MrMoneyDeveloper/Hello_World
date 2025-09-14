import { geolocate, fmtNum, renderCard } from '../utils.js';
import { getAir } from '../weather.js';

export async function render(el){
  const loc = await geolocate();
  try{
    const data = await getAir(loc);
    const pm = (data.hourly && data.hourly.pm2_5 && data.hourly.pm2_5[0]) || 0;
    const label = pm<=12?'Good':pm<=35?'Moderate':pm<=55?'Unhealthy (SG)':pm<=150?'Unhealthy':'Very Unhealthy';
    renderCard(el, 'Air Quality', `<div class="big">${fmtNum(pm)}</div><div>PM2.5 µg/m³ — ${label}</div>`);
  }catch(e){ renderCard(el, 'Air Quality', '<div class="small error">Air quality failed to load</div>'); }
}

