# Tom & Jerry — Happy Birthday, Tom

A static, responsive birthday keepsake for Prasath from Komal.

## Personalize

- Edit `dist/content.js` for the birthday date and all 10 photos.
- The 10 supplied photos are in `dist/media/`, in attachment order. They display at their natural aspect ratio without cropping. Update each photo's `src` to replace it.
- Countdown targets September 30, 2026 at 00:00 India time. It stays on the birthday message after reaching zero.

- Replace `dist/media/nanbiye.mp3` to update the background track.

## Structure

`dist/index.html`, `style.css`, `content.js`, `app.js`, and `music.js` are the editable source and deployment output. No build or dependencies required.

The scroll journey reveals content with IntersectionObserver and supports reduced motion. Scratch works with pointer/touch input or an accessible reveal button. Diary supports ten bounded pages. Gift and secret letter are expandable. Background music uses the supplied MP3, attempts autoplay and loops. When browsers block autoplay, the first click/key interaction or the persistent Play music button starts playback. Pausing cancels automatic retries. No account/data collection.
