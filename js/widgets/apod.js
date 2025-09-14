import { j, NASA_KEY, renderCard } from '../utils.js';

export async function render(el){
  try{
    const data = await j(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
    if (data.media_type === 'image') {
      renderCard(el, 'NASA APOD', `<img class="media" src="${data.url}" alt="${data.title}"/><div class="small">${data.title}</div>`);
    } else {
      renderCard(el, 'NASA APOD', `<a href="${data.url}" target="_blank" rel="noopener">Watch: ${data.title}</a>`);
    }
  }catch(e){ renderCard(el, 'NASA APOD', '<div class="small error">APOD failed to load</div>'); }
}
