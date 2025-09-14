import { renderCard } from '../utils.js';

export async function render(el){
  const body = `
    <div class="media-frame">
      <img src="assets/climate_poster.jpg" alt="Aerial shot of coastline affected by erosion" loading="lazy" decoding="async" />
    </div>
    <div class="caption small">Climate signal: local weather is today; global trend needs long horizons.</div>
    <details class="expand">
      <summary>Explore clip</summary>
      <div class="media-frame" style="margin-top:.5rem;">
        <video src="assets/climate_hero.mp4" poster="assets/climate_poster.jpg" muted loop playsinline controls preload="metadata"></video>
      </div>
      <div class="caption small">Credit: placeholder — replace with your own</div>
    </details>`;
  renderCard(el, 'Climate', body);
}
