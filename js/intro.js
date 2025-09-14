// Pick the intro video present in assets/
// Using the uploaded globe intro by default
const INTRO_VIDEO = 'Vids/intro_globe.mp4';

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('intro-overlay');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipIntro');

  // Ensure the source points at our INTRO_VIDEO
  if (introVideo) {
    const source = introVideo.querySelector('source');
    if (source) {
      source.src = `assets/${INTRO_VIDEO}`;
      // Reload the video element to pick up the new source if needed
      introVideo.load();
    }
  }

  const end = () => overlay && overlay.classList.add('hidden');
  if (introVideo) introVideo.addEventListener('ended', end);
  if (skipBtn) skipBtn.addEventListener('click', end);
});
