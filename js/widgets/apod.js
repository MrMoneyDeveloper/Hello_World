import { renderCard } from '../utils.js';
import { getAPOD } from '../space.js';

export async function render(el){
  try{
    const data = await getAPOD();
    if (data.media_type === 'image') {
      renderCard(el, 'NASA APOD', `<img class=\"media\" src=\"${data.url}\" alt=\"${data.title}\"/><div class=\"small\">${data.title}</div>`);
    } else {
      renderCard(el, 'NASA APOD', `<a href=\"${data.url}\" target=\"_blank\" rel=\"noopener\">Watch: ${data.title}</a>`);
    }
  }catch(e){
    const card = el.closest('section.card') || el;
    card.style.display = 'none';
  }
}
