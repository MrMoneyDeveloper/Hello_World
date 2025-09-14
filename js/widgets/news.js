import { renderCard } from '../utils.js';
import { getHNFrontPage } from '../news.js';

export async function render(el){
  try{
    const data = await getHNFrontPage();
    const items = (data.hits||[]).slice(0,5).map(h=>`<li><a href="${h.url||('https://news.ycombinator.com/item?id='+h.objectID)}" target="_blank" rel="noopener">${h.title}</a></li>`).join('');
    renderCard(el, 'Tech Headlines', `<ul class="list">${items}</ul>`);
  }catch(e){ renderCard(el, 'Tech Headlines', '<div class="small error">News failed to load</div>'); }
}
