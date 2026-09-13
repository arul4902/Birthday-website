'use strict';
(() => {
  const audio = document.getElementById('backgroundMusic');
  const button = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  const status = document.getElementById('musicStatus');
  const controls = document.querySelector('.music-controls');
  let pending = false;
  let automaticallyStart = true;

  if (!audio || !button || !label || !status || !controls) return;

  // Keep the music control clearly visible on all screen sizes.
  Object.assign(controls.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: '99999',
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    pointerEvents: 'auto'
  });

  Object.assign(button.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: '46px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid #a69770',
    background: '#fffaf0',
    color: '#2f493e',
    boxShadow: '0 5px 25px rgba(35,55,43,.18)'
  });

  audio.volume = 0.5;

  function update(playing) {
    label.textContent = playing ? 'Pause music' : 'Play music';
    button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    button.setAttribute('aria-pressed', String(playing));
    button.classList.toggle('playing', playing);
    button.style.background = playing ? '#2f493e' : '#fffaf0';
    button.style.color = playing ? '#fffaf0' : '#2f493e';
  }

  function stopGestureRetry() {
    document.removeEventListener('click', firstInteraction);
    document.removeEventListener('keydown', firstInteraction);
  }

  async function playMusic() {
    if (pending || !audio.paused) return;
    pending = true;
    try {
      await audio.play();
      status.textContent = 'Background music is playing.';
    } catch (error) {
      update(false);
      status.textContent = error.name === 'NotAllowedError'
        ? 'Tap Play music to start the song.'
        : 'Music could not start. Tap Play music to try again.';
    } finally {
      pending = false;
    }
  }

  function firstInteraction(event) {
    if (!automaticallyStart || event.target.closest('.music-controls')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    playMusic();
  }

  button.addEventListener('click', () => {
    automaticallyStart = false;
    stopGestureRetry();
    if (pending) return;
    if (audio.paused) playMusic();
    else {
      audio.pause();
      status.textContent = 'Background music is paused.';
    }
  });

  audio.addEventListener('play', () => {
    update(true);
    stopGestureRetry();
  });
  audio.addEventListener('pause', () => update(false));
  audio.addEventListener('error', () => {
    update(false);
    status.textContent = 'The song is unavailable. Please reload to try again.';
  });

  document.addEventListener('click', firstInteraction);
  document.addEventListener('keydown', firstInteraction);
  audio.src = window.BIRTHDAY_CONTENT.song;
  playMusic();
})();
