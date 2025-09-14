import { geolocate, isDurbanFallback, fmtNum, renderCard, bus } from '../utils.js';
import { getWeather } from '../weather.js';

export async function render(el){
  const loc = await geolocate();
  try{
    const data = await getWeather(loc);
    const cw = data.current || {};
    const hint = isDurbanFallback(loc) ? ' <span class="small">(Durban fallback)</span>' : '';
    const body = `<div class="big">${fmtNum(cw.temperature_2m)}°C</div><div>Wind ${fmtNum(cw.wind_speed_10m)} km/h${hint}</div>`;
    renderCard(el, 'Weather', body);
    if (typeof cw.wind_speed_10m === 'number') bus.emit('weather:wind', cw.wind_speed_10m);
  }catch(e){ renderCard(el, 'Weather', '<div class="small error">Weather failed to load</div>'); }
}

