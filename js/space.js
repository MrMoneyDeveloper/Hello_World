import { KEYS } from './config.js';
import { cachedJSON } from './fetcher.js';

export async function getAPOD(){
  return cachedJSON(`https://api.nasa.gov/planetary/apod?api_key=${KEYS.NASA}`);
}

