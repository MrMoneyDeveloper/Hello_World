// Intro video path inside assets/
const INTRO_VIDEO = 'Vids/intro_globe.mp4';

// Config: keep intro snappy and skippable
const INTRO_MAX_MS = 6000;           // hard cap: hide after 6s
const INTRO_PLAY_GUARD_MS = 1500;    // if playback doesn't start in 1.5s, skip
const INTRO_SEEN_KEY = 'wp:introSeenAt';
const INTRO_SEEN_TTL_MS = 24 * 60 * 60 * 1000; // show at most once/day

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('intro-overlay');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipIntro');

  if (!overlay || !introVideo) return;

  // Respect reduced motion and seen-within-24h
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seenAt = Number(localStorage.getItem(INTRO_SEEN_KEY) || 0);
  const seenRecently = Date.now() - seenAt < INTRO_SEEN_TTL_MS;

  const hideIntro = () => {
    overlay.classList.add('hidden');
    try { introVideo.pause(); } catch {}
    try { localStorage.setItem(INTRO_SEEN_KEY, String(Date.now())); } catch {}
  };

  if (prefersReduced || seenRecently) {
    hideIntro();
    return;
  }

  // Ensure the source points at our INTRO_VIDEO
  const source = introVideo.querySelector('source');
  if (source) {
    source.src = `assets/${INTRO_VIDEO}`;
    introVideo.load();
  }

  // Wires: end/skip/timeout/guard
  introVideo.addEventListener('ended', hideIntro);
  if (skipBtn) skipBtn.addEventListener('click', hideIntro);

  // Guard: if playback doesn't begin quickly, skip
  const guardTimer = setTimeout(hideIntro, INTRO_PLAY_GUARD_MS);
  const onPlaying = () => { clearTimeout(guardTimer); };
  introVideo.addEventListener('playing', onPlaying, { once: true });

  // Hard cap duration to keep things snappy
  setTimeout(hideIntro, INTRO_MAX_MS);
});
