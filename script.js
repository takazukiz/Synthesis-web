document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('synthesis');
  const countdownEl = document.getElementById('countdown');
  if (!el) return;

  const base = 'Synthesis';
  const suffixes = ['.genesis()','.impetus()','.acceleration()','.recursion()','.oracle()','.metacognition()','.irrationality()','.transcendence()','.dimension()','.diffraction()','.chroma()', '.terminus()'];

  let timeoutId = null;
  let intervalId = null;
  let endTime = 0;
  
  function pickRandomSuffix() {
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  function randomSeconds(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  

  function updateCountdown() {
    if (!countdownEl) return;
    const remainingMs = Math.max(0, endTime - Date.now());
    const totalSeconds = (remainingMs / 1000);
    const intPart = Math.floor(totalSeconds);
    const frac = Math.floor((totalSeconds - intPart) * 100).toString().padStart(2, '0');
    const intStr = intPart.toString().padStart(2, '0');
    const remainingSec = `${intStr}.${frac}`;
    countdownEl.textContent = `Next phase in: ${remainingSec}s`;
    // keep header glow copy in sync with updated countdown text
    if (countdownEl.dataset) countdownEl.dataset.glow = countdownEl.textContent;
    if (remainingMs <= 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function scheduleNext() {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) { clearInterval(intervalId); intervalId = null; }

    const suffix = pickRandomSuffix();
    el.textContent = base + suffix;
    // keep header glow copy in sync when the visible text changes
    try { el.dataset.glow = el.textContent; } catch(e) {}
    const seconds = randomSeconds(5, 13);
    endTime = Date.now() + seconds * 1000;

    // start countdown updates (every 100ms for smooth .00 display)
    updateCountdown();
    intervalId = setInterval(updateCountdown, 100);

    console.log('Set suffix', suffix, 'for', seconds, 's');
    timeoutId = setTimeout(scheduleNext, seconds * 1000);
  }
  
  // start immediately (moved behind intro sequence)

  function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

  async function runIntroSequence(){
    const intro = document.getElementById('intro');
    const logo = document.getElementById('intro-logo');
    if(!intro || !logo){
      return;
    }

    // timings (ms)
    const logoFadeIn = 800;
    const holdBeforeBgFade = 600;
    const bgFade = 1000;
    const postBgHold = 300;
    const logoFadeOut = 800;

    // ensure visible
    intro.style.display = 'flex';

    // 1) fade in logo (faint) — wait for the image to be ready so fade is visible
    try {
      if (logo.decode) {
        await logo.decode();
      } else if (!logo.complete) {
        await new Promise((res) => {
          logo.addEventListener('load', res, { once: true });
          logo.addEventListener('error', res, { once: true });
        });
      }
    } catch (e) {
      // ignore decode errors and continue
    }
    intro.classList.add('logo-visible');
    await wait(logoFadeIn + 50);

    // 2) after short hold, fade out the black background overlay and the logo together
    await wait(holdBeforeBgFade);
    intro.classList.add('bg-fade-out', 'logo-fade-out');
    // wait for background fade duration + small post hold
    await wait(bgFade + postBgHold + 50);

    // hide intro entirely
    intro.style.display = 'none';
  }

  // start schedule immediately (timers/countdown should run during intro)
  scheduleNext();

  // run intro in parallel
  runIntroSequence();

  // header glow: set data-glow on header children so CSS ::before can show a colored blurred copy
  (function initHeaderGlow(){
    const header = document.querySelector('header');
    if(!header) return;
    const targets = header.querySelectorAll('#synthesis, #countdown');
    targets.forEach(el => {
      el.classList.add('has-glow');
      el.dataset.glow = el.textContent;
    });
  })();
});
