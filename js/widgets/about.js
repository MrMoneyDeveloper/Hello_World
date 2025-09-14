import { renderCard } from '../utils.js';

export async function render(el){
  const body = `
    <details class="expand">
      <summary>About this site</summary>
      <div class="small" style="margin-top:.5rem">
        <p><strong>World Pulse</strong> surfaces compact signals from public APIs — markets, weather, NASA imagery, headlines — so you can glance and move on.</p>
        <p><strong>Privacy:</strong> no tracking, no analytics. Geolocation is optional and only used in‑browser to localize weather/air quality; add <code>?demo=no-gps</code> to force the Durban fallback.</p>
        <p><strong>Media:</strong> the Climate card uses placeholders. Replace <code>assets/climate_poster.jpg</code> and <code>assets/climate_hero.mp4</code> with your own. See README for suggested sizes.</p>
      </div>
    </details>`;
  renderCard(el, 'Welcome', body);
}

