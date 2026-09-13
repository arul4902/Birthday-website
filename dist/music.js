'use strict';
(() => {
  const audio = document.getElementById('backgroundMusic');
  const button = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  const status = document.getElementById('musicStatus');
  const controls = document.querySelector('.music-controls');

  if (audio && button && label && status && controls) {
    let pending = false;
    let automaticallyStart = true;

    Object.assign(controls.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: '99999',
      display: 'block', visibility: 'visible', opacity: '1', pointerEvents: 'auto'
    });

    Object.assign(button.style, {
      display: 'flex', alignItems: 'center', gap: '8px', minHeight: '46px',
      padding: '10px 16px', borderRadius: '999px', border: '1px solid #a69770',
      background: '#fffaf0', color: '#2f493e', boxShadow: '0 5px 25px rgba(35,55,43,.18)'
    });

    audio.volume = 0.65;
    audio.preload = 'auto';
    audio.loop = true;
    audio.src = window.BIRTHDAY_CONTENT.song;
    audio.load();

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
      document.removeEventListener('touchstart', firstInteraction);
    }

    async function playMusic() {
      if (pending || !audio.paused) return;
      pending = true;
      try {
        await audio.play();
        status.textContent = 'Background music is playing.';
      } catch (error) {
        update(false);
        status.textContent = 'Tap Play music to start the song.';
      } finally {
        pending = false;
      }
    }

    function firstInteraction(event) {
      if (!automaticallyStart) return;
      if (event.target && event.target.closest && event.target.closest('.music-controls')) return;
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
      status.textContent = 'Song file is missing or damaged.';
    });

    document.addEventListener('click', firstInteraction);
    document.addEventListener('keydown', firstInteraction);
    document.addEventListener('touchstart', firstInteraction, { passive: true });

    update(false);
    playMusic();
  }

  function tidyGallery() {
    document.querySelectorAll('.photo-card').forEach(card => {
      const slot = card.querySelector('.photo-slot');
      const img = card.querySelector('img');
      if (!slot || !img) return;

      const showFullPhoto = () => {
        slot.style.aspectRatio = 'auto';
        slot.style.height = 'auto';
        slot.style.minHeight = '0';
        slot.style.display = 'block';
        slot.style.overflow = 'hidden';
        slot.style.background = '#fffdf8';

        img.style.position = 'static';
        img.style.inset = 'auto';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = 'none';
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center';
      };

      const removeBroken = () => card.remove();

      if (img.complete) {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) showFullPhoto();
        else removeBroken();
      } else {
        img.addEventListener('load', showFullPhoto, { once: true });
        img.addEventListener('error', removeBroken, { once: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tidyGallery, { once: true });
  } else {
    tidyGallery();
  }
  window.addEventListener('load', tidyGallery, { once: true });
})();
