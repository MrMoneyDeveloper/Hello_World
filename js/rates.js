import { cachedJSON } from './fetcher.js';

export async function getZarRate(base="USD"){ 
  const url=`https://api.exchangerate.host/latest?base=${base}&symbols=ZAR`;
  return cachedJSON(url);
}

