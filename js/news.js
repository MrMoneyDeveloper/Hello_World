import { cachedJSON } from './fetcher.js';

export async function getHNFrontPage(){
  return cachedJSON("https://hn.algolia.com/api/v1/search?tags=front_page");
}

