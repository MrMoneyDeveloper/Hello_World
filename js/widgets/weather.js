import { geolocate, isDurbanFallback, j, fmtNum, renderCard, bus } from '../utils.js';

export async function render(el){
  const loc = await geolocate();
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true&timezone=auto`;
    const data = await j(url);
    const cw = data.current_weather;
    const hint = isDurbanFallback(loc) ? ' <span class="small">(Durban fallback)</span>' : '';
    const body = `<div class="big">${fmtNum(cw.temperature)}°C</div><div>Wind ${fmtNum(cw.windspeed)} km/h${hint}</div>`;
    renderCard(el, 'Weather', body);
    if (cw && typeof cw.windspeed === 'number') bus.emit('weather:wind', cw.windspeed);
  }catch(e){ renderCard(el, 'Weather', '<div class="small error">Weather failed to load</div>'); }
}
