import { cachedJSON } from './fetcher.js';

export async function getWeather({lat,lon}) {
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  return cachedJSON(url);
}
export async function getAir({lat,lon}) {
  const url=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide`;
  return cachedJSON(url);
}

