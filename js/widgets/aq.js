import { geolocate, j, fmtNum, renderCard } from '../utils.js';

export async function render(el){
  const loc = await geolocate();
  try{
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.lat}&longitude=${loc.lon}&current=european_aqi,pm10,pm2_5`;
    const data = await j(url);
    const aqi = (data.current && data.current.european_aqi) || 0;
    const label = aqi<=50?'Good':aqi<=100?'Moderate':aqi<=150?'Unhealthy (SG)':aqi<=200?'Unhealthy':'Very Unhealthy';
    renderCard(el, 'Air Quality', `<div class="big">${fmtNum(aqi)}</div><div>${label}</div>`);
  }catch(e){ renderCard(el, 'Air Quality', '<div class="small error">Air quality failed to load</div>'); }
}
