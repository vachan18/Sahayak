/* Sahayak demo stage — drives the real app inside a device frame and choreographs the film. */
const P = new URLSearchParams(location.search);
const MODE = P.get('mode') || 'desktop';
const FAST = P.get('fast') === '1';
const MOBILE = MODE === 'mobile';
document.body.classList.add(MODE);
if (MOBILE) document.querySelector('#cursor svg').style.display = 'none';

const [NARR_ALL, DUR] = await Promise.all([fetch('narration.json').then((r) => r.json()), fetch('durations.json').then((r) => r.json())]);
const NARR = NARR_ALL[MODE];
const $ = (s) => document.querySelector(s);
const rig = $('#rig');
const sleep = (ms) => new Promise((r) => setTimeout(r, FAST ? ms / 8 : ms));
const log = (...a) => console.log(...a);

/* ── App frame ───────────────────────────────────────────────────────────── */
localStorage.setItem('sahayak_language', 'en');
localStorage.setItem('sahayak_prefs', JSON.stringify({ theme: 'light', audio: false }));
sessionStorage.setItem('sahayak_welcome_spoken', '1');

rig.innerHTML = MOBILE
  ? `<div class="phone"><div class="screen"><iframe id="app" src="/welcome"></iframe></div></div>`
  : `<div class="browser"><div class="bar"><div class="dots"><span style="background:#FF5F57"></span><span style="background:#FEBC2E"></span><span style="background:#28C840"></span></div><div class="url"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DAF8F" stroke-width="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><b>sahayak.app</b><span id="path">/welcome</span></div></div><iframe id="app" src="/welcome"></iframe></div>`;
const frame = $('#app');
const W = () => frame.contentWindow;
const D = () => frame.contentDocument;
await new Promise((r) => frame.addEventListener('load', r, { once: true }));
await sleep(1500);
setInterval(() => {
  const p = $('#path');
  if (p) p.textContent = W().location.pathname + W().location.search;
}, 200);

/* ── Helpers ─────────────────────────────────────────────────────────────── */
async function waitFor(fn, timeout = 6000) {
  const t0 = performance.now();
  while (performance.now() - t0 < timeout) {
    try {
      const v = fn();
      if (v) return v;
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
  }
  return null;
}
const visible = (el) => {
  const r = el.getBoundingClientRect();
  const cs = W().getComputedStyle(el);
  return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05;
};
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
function find(q, scope) {
  const doc = D();
  if (typeof q !== 'string') return q;
  if (q.startsWith('css:')) {
    const all = [...(scope || doc).querySelectorAll(q.slice(4))].filter(visible);
    return all[0] || null;
  }
  const want = norm(q);
  const root = scope || doc;
  const dialog = doc.querySelector('[role="dialog"]');
  const pools = dialog ? [dialog, root] : [root];
  for (const pool of pools) {
    const cands = [...pool.querySelectorAll('button, a, [role="radio"], [role="option"], [role="switch"], label, summary, li[role="option"]')].filter(visible);
    const exact = cands.filter((e) => norm(e.textContent) === want || norm(e.getAttribute('aria-label')) === want);
    if (exact.length) return exact[0];
    const part = cands.filter((e) => norm(e.textContent).includes(want) || norm(e.getAttribute('aria-label')).includes(want));
    if (part.length) return part.sort((a, b) => norm(a.textContent).length - norm(b.textContent).length)[0];
  }
  return null;
}
function stagePos(el) {
  const fr = frame.getBoundingClientRect();
  const s = fr.width / frame.offsetWidth;
  const r = el.getBoundingClientRect();
  return { x: fr.left + (r.left + r.width / 2) * s, y: fr.top + (r.top + r.height / 2) * s, s, r, fr };
}
const cursor = $('#cursor');
let cx = 1500, cy = 600;
function moveCursor(x, y) {
  cx = x; cy = y;
  cursor.style.transform = `translate(${x - (MOBILE ? 0 : 4)}px, ${y - (MOBILE ? 0 : 3)}px)`;
}
moveCursor(MOBILE ? 1363 : 1500, MOBILE ? 760 : 600);
cursor.style.opacity = '0';
function ripple(x, y) {
  const d = document.createElement('div');
  d.className = 'ripple';
  d.style.left = x + 'px';
  d.style.top = y + 'px';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 800);
}
async function ensureInView(el) {
  const r = el.getBoundingClientRect();
  const vh = W().innerHeight;
  if (r.top < 70 || r.bottom > vh - (MOBILE ? 100 : 20)) {
    await scrollBy(r.top - vh * 0.38, 700);
  }
}
async function click(q, opts = {}) {
  const el = await waitFor(() => find(q), opts.timeout ?? 6000);
  if (!el) {
    log('MISS', String(q));
    return null;
  }
  if (!opts.noScroll) await ensureInView(el);
  const p = stagePos(el);
  cursor.style.opacity = '1';
  moveCursor(p.x, p.y);
  await sleep(opts.travel ?? 780);
  ripple(p.x, p.y);
  await sleep(120);
  el.click();
  await sleep(opts.after ?? 650);
  return el;
}
async function hover(q, ms = 900) {
  const el = await waitFor(() => find(q), 4000);
  if (!el) return log('MISS hover', String(q));
  await ensureInView(el);
  const p = stagePos(el);
  cursor.style.opacity = '1';
  moveCursor(p.x, p.y);
  el.dispatchEvent(new (W().MouseEvent)('mouseover', { bubbles: true }));
  await sleep(ms);
}
async function type(q, text, perChar = 55) {
  const el = await waitFor(() => find(q), 5000);
  if (!el) return log('MISS type', String(q));
  const p = stagePos(el);
  cursor.style.opacity = '1';
  moveCursor(p.x, p.y);
  await sleep(700);
  ripple(p.x, p.y);
  el.focus();
  const proto = el.tagName === 'TEXTAREA' ? W().HTMLTextAreaElement.prototype : W().HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  for (let i = 1; i <= text.length; i++) {
    setter.call(el, text.slice(0, i));
    el.dispatchEvent(new (W().Event)('input', { bubbles: true }));
    await sleep(perChar);
  }
  return el;
}
function submit(el) {
  if (el?.form) el.form.requestSubmit();
}
function key(k, opts = {}) {
  const ev = new (W().KeyboardEvent)('keydown', { key: k, bubbles: true, cancelable: true, ...opts });
  const t = opts.target === 'window' ? W() : opts.target === 'input' ? D().querySelector('input[role="combobox"]') || D() : D();
  t.dispatchEvent(ev);
}
function scrollBy(dy, ms = 1200) {
  const w = W();
  const start = w.scrollY;
  return scrollTo(start + dy, ms);
}
function scrollTo(y, ms = 1400) {
  const w = W();
  const start = w.scrollY;
  const max = D().documentElement.scrollHeight - w.innerHeight;
  const end = Math.max(0, Math.min(max, typeof y === 'number' ? y : 0));
  const t0 = performance.now();
  const dur = FAST ? ms / 8 : ms;
  return new Promise((res) => {
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      w.scrollTo(0, start + (end - start) * e);
      if (k < 1) requestAnimationFrame(step);
      else res();
    };
    requestAnimationFrame(step);
  });
}
async function scrollToEl(q, offset = 0.18, ms = 1300) {
  const el = await waitFor(() => (typeof q === 'string' ? (q.startsWith('css:') ? D().querySelector(q.slice(4)) : find(q)) : q), 4000);
  if (!el) return log('MISS scrollToEl', String(q));
  const y = W().scrollY + el.getBoundingClientRect().top - W().innerHeight * offset;
  await scrollTo(y, ms);
}
async function go(path) {
  W().history.pushState({}, '', path);
  W().dispatchEvent(new PopStateEvent('popstate'));
  await sleep(1100);
}
async function closeSheet() {
  const btn = D().querySelector('[role="dialog"] [data-sheet-close]') || [...D().querySelectorAll('[role="dialog"] button')].find((b) => /close|बंद|ಮುಚ್ಚ/i.test(b.getAttribute('aria-label') || ''));
  if (btn && visible(btn)) await click(btn, { travel: 600, after: 700, noScroll: true });
  else {
    key('Escape');
    await sleep(600);
  }
  // belt and braces: nothing should stay open into the next scene
  if (D().querySelector('[role="dialog"]')) {
    key('Escape');
    await sleep(500);
  }
}
/** Camera move: zoom the device toward an element. */
async function zoom(q, scale = 1.45) {
  const el = typeof q === 'string' ? await waitFor(() => (q.startsWith('css:') ? D().querySelector(q.slice(4)) : find(q)), 3000) : q;
  if (!el) return log('MISS zoom', String(q));
  const rr = rig.getBoundingClientRect();
  const fr = frame.getBoundingClientRect();
  const s0 = fr.width / frame.offsetWidth;
  const r = el.getBoundingClientRect();
  const px = fr.left + (r.left + r.width / 2) * s0 - rr.left;
  const py = fr.top + (r.top + r.height / 2) * s0 - rr.top;
  // translate so the target lands in the centre of the rig, then scale around the centre
  const tx = (rig.offsetWidth / 2 - px) * scale;
  const ty = (rig.offsetHeight / 2 - py) * scale;
  cursor.style.opacity = '0';
  rig.style.transform = `translate(${tx * 0.62}px, ${ty * 0.62}px) scale(${scale})`;
  await sleep(1300);
}
async function unzoom() {
  rig.style.transform = '';
  await sleep(1100);
}

/* ── Captions ────────────────────────────────────────────────────────────── */
function caption(id, chapter, title = '') {
  const text = NARR[id] || '';
  $('#chap').innerHTML = chapter ? `<span class="n">${chapter.split('·')[0].trim()}</span>${chapter.split('·').slice(1).join('·').trim()}` : '';
  if (MOBILE) $('#title').textContent = title;
  const sub = $('#sub');
  const parts = text.match(/[^.!?]+[.!?]+/g) || [text];
  const total = parts.reduce((a, p) => a + p.length, 0);
  const dur = (DUR[id] || 4) * 1000;
  if (MOBILE) {
    sub.innerHTML = parts.map((p) => `<span style="opacity:.28">${p.trim()} </span>`).join('');
    const spans = [...sub.children];
    let acc = 0;
    parts.forEach((p, i) => {
      setTimeout(() => spans.forEach((s, j) => (s.style.opacity = j === i ? '1' : j < i ? '.55' : '.28')), FAST ? 0 : (acc / total) * dur);
      acc += p.length;
    });
  } else {
    let acc = 0;
    parts.forEach((p) => {
      setTimeout(() => {
        sub.innerHTML = `<span>${p.trim()}</span>`;
      }, FAST ? 0 : (acc / total) * dur);
      acc += p.length;
    });
  }
}

/* ── Scenes ──────────────────────────────────────────────────────────────── */
async function scene(id, chapter, fn, { title = '', pad = 700 } = {}) {
  log('SCENE', id, Date.now());
  caption(id, chapter, title);
  const narr = sleep((DUR[id] || 3) * 1000 + pad);
  await Promise.all([narr, fn ? fn() : Promise.resolve()]);
}
const card = $('#card');
async function showCard(html) {
  rig.classList.add('dim');
  cursor.style.opacity = '0';
  $('#cap').style.opacity = MOBILE ? '0' : '1';
  card.classList.remove('on');
  await sleep(350);
  card.innerHTML = `<div class="c">${html}</div>`;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  card.classList.add('on');
}
async function hideCard() {
  card.classList.remove('on');
  await sleep(500);
  card.innerHTML = '';
  rig.classList.remove('dim');
  $('#cap').style.opacity = '1';
  await sleep(700);
}

const LOGO = `<svg class="logoDraw" viewBox="0 0 100 114" width="150" height="171"><path d="M50.5 3.5C38 10.5 22 16 4.5 19 3.5 46 6.5 71 19.5 88.5M27.5 96.5C34.5 102.5 42 106.5 50.5 110.5 61 106 72 100 81 89 95 72 98 46 96.5 19 79 16 63 10.5 50.5 3.5" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="#1DAF8F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 42A35 35 0 0 1 83.5 42"/><path d="M15.6 58A35 35 0 0 0 26 79L19 92.5 35.5 87.5Q45 91 54.5 89.5"/><path d="M73.5 82A35 35 0 0 0 85.4 58"/></g><g fill="#FC7C24"><circle cx="35.5" cy="46.5" r="5.6"/><circle cx="66.5" cy="47.5" r="5.6"/><path d="M13.5 43.5C20 51 27 55.5 33 56.5 36.5 57 40 56.5 42.5 54.5 47 50.5 49.5 43 50.5 32.5 53 41 52.5 50 49 58 47 63 47.5 70 49 77 50 81 49 84 47 86L36 86C37.5 80 37.5 74 35 68 33 64.5 29.5 62 26 60 21 57 16.5 51.5 13.5 43.5Z"/><path d="M87.5 44.5C82 52 76 56.5 70.5 57.5 67 58 63.5 57.5 60.5 55.5 57.5 53 56 48.5 55 42 53.5 48 53 55 55 60.5 57 65.5 57.5 70 57 75 56.5 79.5 57 83.5 59 87.5L66.5 85.5C67 80 68 74 71 69 73.5 65 77 62.5 80 60 84 56.5 86.5 51 87.5 44.5Z"/></g></svg>`;

const CARDS = {
  title: (sub) => `<div class="center st">${LOGO}<div class="word">SAHAYAK</div><div class="tag">${sub}</div><div class="meta">PIXELCRAFT 2026 · TRACK DS-02 · PUBLIC GOOD &amp; DIGITAL INCLUSION · TEAM PIXEL THEORY</div></div>`,
  problem: `<div class="st"><div class="eyebrow">01 · THE PROBLEM</div><h2 class="h">Welfare exists. <em>Reaching it</em> is the hard part.</h2>
    <div class="grid4"><div class="tile"><div class="k">अ</div><h3>Language</h3><p>Portals speak English and formal Hindi — not the language people think in.</p></div>
    <div class="tile"><div class="k">?</div><h3>Jargon</h3><p>“DBT seeding”, “SECC category”, “gazetted attestation”. Fear of getting it wrong.</p></div>
    <div class="tile"><div class="k">₹</div><h3>Middlemen</h3><p>₹200–₹1,500 paid to agents for help that should be free.</p></div>
    <div class="tile"><div class="k">◌</div><h3>Black box</h3><p>“Pending at L2.” No timeline, no recourse, constant anxiety.</p></div></div></div>`,
  people: `<div class="st"><div class="eyebrow">02 · WHO WE DESIGN FOR</div><h2 class="h">Real people. <em>Real constraints.</em></h2>
    <div class="people">
      <div class="person"><img src="/people/farmer.webp"><div><div class="r">Smallholder farmer · UP / Karnataka</div><div class="n">Rameshwar, 52</div><div class="q">Cannot type. Shared 2 GB phone. Uses it outdoors.</div></div></div>
      <div class="person"><img src="/people/mother.webp"><div><div class="r">Mother &amp; domestic worker</div><div class="n">Lakshmi, 36</div><div class="q">Can’t read the state script. Loses ₹500 for every wrong queue.</div></div></div>
      <div class="person"><img src="/people/weaver-man.webp"><div><div class="r">Handloom weaver · West Bengal</div><div class="n">Arindam, 28</div><div class="q">Needs ₹20,000 working capital. Forms ask what he doesn’t understand.</div></div></div>
      <div class="person"><img src="/people/student.webp"><div><div class="r">Student &amp; family proxy</div><div class="n">Sunita, 19</div><div class="q">Applies for six relatives from one phone.</div></div></div></div></div>`,
  principles: `<div class="st"><div class="eyebrow">03 · DESIGN PRINCIPLES</div><h2 class="h">Five rules behind <em>every screen.</em></h2>
    <div class="principles st"><div class="pr"><b>1</b>Speak first, read second</div><div class="pr"><b>2</b>Show the money</div><div class="pr"><b>3</b>One decision per screen</div><div class="pr"><b>4</b>Always say what comes next</div><div class="pr"><b>5</b>Trust is a feature, not a footnote</div></div></div>`,
  colour: `<div class="st"><div class="eyebrow">04 · COLOUR, FROM THE EMBLEM</div><h2 class="h">Navy for trust. Orange for action. <em>Teal for help.</em></h2>
    <div class="sw"><div class="swatch" style="background:#111E33;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)"><div class="hex">#111E33 · THE SHIELD</div><h3>Navy</h3><p>Trust and the State’s guarantee. Text, navigation, deep panels.</p></div>
      <div class="swatch" style="background:#FC7C24;color:#111E33"><div class="hex">#FC7C24 · THE PEOPLE</div><h3>Orange</h3><p>Warmth and action. Reserved for the one primary action per screen.</p></div>
      <div class="swatch" style="background:#1DAF8F;color:#06241D"><div class="hex">#1DAF8F · THE VOICE</div><h3>Teal</h3><p>Help and success. “You qualify”, “done”, “ready”.</p></div></div>
    <div class="ratio"><div style="flex:60;background:#F6F7FA"></div><div style="flex:30;background:#111E33;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)"></div><div style="flex:10;background:#FC7C24"></div></div>
    <div class="badges"><span class="badge">60 · 30 · 10 balance</span><span class="badge">WCAG 2.2 AA in Day &amp; Night</span><span class="badge">Navy on orange 6.4 : 1</span><span class="badge">Sunlight mode for outdoors</span></div></div>`,
  type: `<div class="st"><div class="eyebrow">05 · TYPOGRAPHY FOR 13 LANGUAGES</div><h2 class="h">One voice, <em>ten scripts.</em></h2>
    <div class="lead">Plus Jakarta Sans (Latin) + Noto Sans for every Indian script + Noto Nastaliq for Urdu. Script-aware line heights. Only your language’s font is downloaded.</div>
    <div class="scripts"><span>Sahayak</span><span style="font-family:'Noto Sans Devanagari'">सहायक</span><span style="font-family:'Noto Sans Kannada'">ಸಹಾಯಕ</span><span style="font-family:'Noto Sans Tamil'">சகாயக்</span><span style="font-family:'Noto Sans Telugu'">సహాయక్</span><span style="font-family:'Noto Sans Bengali'">সহায়ক</span><span style="font-family:'Noto Sans Gurmukhi'">ਸਹਾਇਕ</span><span style="font-family:'Noto Sans Gujarati'">સહાયક</span><span style="font-family:'Noto Sans Malayalam'">സഹായക്</span><span style="font-family:'Noto Sans Oriya'">ସହାୟକ</span><span style="font-family:'Noto Nastaliq Urdu';font-size:60px">سہایک</span></div></div>`,
  outro: `<div class="center st">${LOGO}<div class="word" style="font-size:96px">SAHAYAK</div><div class="tag">Help, offered — in the language you think in.</div>
    <div class="facts"><span class="fact">13 languages</span><span class="fact">Voice-first</span><span class="fact" style="color:#FC7C24">₹0 to apply</span><span class="fact">WCAG 2.2 AA</span><span class="fact">Works offline</span></div>
    <div class="meta">PIXELCRAFT 2026 · TEAM PIXEL THEORY · THANK YOU</div></div>`,
};

async function answerEligibility(maxSteps = 8) {
  const prefer = ['Farmer', 'Less than 2.5', 'Male', 'Below ₹1.2', 'General', 'No', '41', '36'];
  for (let i = 0; i < maxSteps; i++) {
    if (/results/.test(W().location.pathname)) return;
    const radios = await waitFor(() => [...D().querySelectorAll('[role="radio"]')].filter(visible), 4000);
    if (!radios || !radios.length) {
      const next = find('See my results') || find('Next') || find('Show results');
      if (next) await click(next);
      else break;
      continue;
    }
    const pick = radios.find((r) => prefer.some((p) => r.textContent.includes(p))) || radios[0];
    await click(pick, { travel: 650, after: 900 });
    await sleep(500);
  }
  if (!/results/.test(W().location.pathname)) {
    const b = find('results');
    if (b) await click(b);
  }
}

/* ══ DESKTOP FILM ══════════════════════════════════════════════════════════ */
async function desktop() {
  await showCard(CARDS.title('Government schemes, in your language.'));
  await scene('d01', '', null, { pad: 1200 });
  await showCard(CARDS.problem);
  await scene('d02', '01 · The problem', null, { pad: 900 });
  await showCard(CARDS.people);
  await scene('d03', '02 · People', null, { pad: 900 });
  await showCard(CARDS.principles);
  await scene('d04', '03 · Principles', null, { pad: 800 });
  await showCard(CARDS.colour);
  await scene('d05', '04 · Colour', null, { pad: 900 });
  await showCard(CARDS.type);
  await scene('d06', '05 · Typography', null, { pad: 900 });
  await hideCard();

  await scene('d07', '06 · First run', async () => {
    await sleep(1200);
    await hover('Tap to hear', 1400);
  });
  await scene('d08', '06 · First run', async () => {
    await click('Continue');
    await sleep(1200);
    await hover('css:button[lang="kn"]', 900);
    await hover('css:button[lang="hi"]', 900);
    await click('css:button[lang="en"]');
    await click('Continue in this language');
  });
  await scene('d09', '06 · First run', async () => {
    await sleep(900);
    await click('Next', { after: 1600 });
    await click('Next', { after: 1600 });
    await sleep(800);
  });
  await scene('d10', '07 · Home', async () => {
    await click('Start using Sahayak', { after: 1800 });
    await zoom('css:#voice-cta', 1.25);
    await sleep(2400);
    await unzoom();
  }, { pad: 400 });
  await scene('d11', '07 · Home', async () => {
    await scrollToEl('css:#next-step', 0.25);
    await zoom('css:nav[aria-label="Your welfare journey"]', 1.45);
    await sleep(3800);
    await unzoom();
  });
  await scene('d12', '07 · Home', async () => {
    await scrollToEl('css:#needs', 0.12, 1500);
    await hover('Agriculture', 900);
    await hover('Women and', 900);
    await hover('Housing', 900);
    await scrollToEl('css:#builtfor', 0.1, 1600);
  });
  await scene('d13', '08 · Sign in', async () => {
    await scrollTo(0, 900);
    await click('css:a[href="/profile"]', { after: 1500 });
    await click('Sign in', { after: 2600 });
    await click('Continue without an account', { after: 900 });
  });
  await scene('d14', '09 · Voice assistant', async () => {
    await go('/home');
    await click('css:aside button', { after: 1400 });
    const input = await type('css:[role="dialog"] input', 'I am a farmer with two acres of land', 60);
    await sleep(300);
    submit(input);
    await sleep(3800);
    await closeSheet();
  });
  await scene('d15', '10 · Eligibility check', async () => {
    await go('/eligibility');
    await answerEligibility();
  }, { pad: 300 });
  await scene('d16', '10 · Eligibility check', async () => {
    await sleep(1500);
    await scrollBy(520, 1800);
    await sleep(1000);
    await scrollBy(560, 1800);
  });
  await scene('d17', '11 · Scheme detail', async () => {
    await go('/schemes');
    await sleep(800);
    await click('PM-KISAN', { after: 1800 });
    await scrollBy(560, 2000);
    await sleep(800);
    await scrollBy(600, 2000);
  });
  await scene('d18', '12 · Papers', async () => {
    await go('/documents');
    await sleep(900);
    await click('Scan paper', { after: 1200 });
    await click('Take photo', { after: 4200 });
    await closeSheet();
  });
  await scene('d19', '13 · Apply', async () => {
    await go('/guidance/pm-kisan');
    await click('Get help at a centre', { after: 900 });
    await click('Make my centre slip', { after: 1800 });
    await scrollBy(500, 1800);
  });
  await scene('d20', '14 · Track', async () => {
    await go('/tracker');
    await sleep(1200);
    await scrollBy(300, 1200);
    await click('Someone asked me for money', { after: 3000 });
    await closeSheet();
  });
  await scene('d21', '15 · Help centres', async () => {
    await go('/help-centres');
    await sleep(1400);
    await click('Open now', { after: 1600 });
  });
  await scene('d22', '16 · Accessibility', async () => {
    await go('/home');
    await click('css:button[aria-label="Reading comfort settings"]', { after: 1000 });
    const radios = await waitFor(() => [...D().querySelectorAll('[role="dialog"] [role="radio"]')]);
    if (radios) {
      await click(radios[2], { after: 1100 });
      await click(radios[0], { after: 700 });
    }
    await click('Night', { after: 1500 });
    await click('Day', { after: 700 });
    await click('Sunlight mode', { after: 1600 });
    await click('Sunlight mode', { after: 600 });
    await closeSheet();
  });
  await scene('d23', '17 · Power users', async () => {
    key('k', { ctrlKey: true, target: 'window' });
    await sleep(900);
    await type('css:input[role="combobox"]', 'kisan', 120);
    await sleep(1600);
    key('Escape', { target: 'input' });
    await sleep(500);
  });
  await scene('d24', '18 · Every language', async () => {
    await click('css:button[aria-label^="Change language"]', { after: 900 });
    await click('css:button[lang="hi"]', { after: 2200 });
    await click('css:button[aria-label^="' + 'भाषा' + '"], button[aria-label*="हिन्दी"]', { after: 900, timeout: 2000 });
    await click('css:button[lang="kn"]', { after: 2200 });
    await click('css:header button[aria-label*="ಕನ್ನಡ"]', { after: 900, timeout: 2000 });
    await click('css:button[lang="ur"]', { after: 2600 });
  });
  await showCard(CARDS.outro);
  await scene('d25', '', null, { pad: 2500 });
}

/* ══ MOBILE FILM ═══════════════════════════════════════════════════════════ */
async function mobile() {
  await showCard(CARDS.title('Designed for the phone in every pocket.'));
  await scene('m01', '', null, { pad: 1000 });
  await hideCard();
  await scene('m02', '01 · First run', async () => {
    await sleep(1600);
    await click('Continue', { after: 1200 });
    await click('css:button[lang="en"]', { after: 600 });
    await click('Continue in this language', { after: 1200 });
    await click('Next', { after: 1100 });
    await click('Next', { after: 1100 });
  }, { title: 'A calm first run' });
  await scene('m03', '02 · Thumb-zone navigation', async () => {
    await click('Start using Sahayak', { after: 1500 });
    await hover('css:nav[aria-label="Main navigation"] button', 1800);
    await click('css:nav[aria-label="Main navigation"] a[href="/eligibility"]', { after: 900 });
    await click('css:nav[aria-label="Main navigation"] a[href="/home"]', { after: 900 });
  }, { title: 'Built for one thumb' });
  await scene('m04', '03 · Home', async () => {
    await scrollBy(700, 2200);
    await sleep(800);
    await scrollBy(900, 2200);
    await sleep(600);
    await scrollBy(-500, 1400);
  }, { title: 'Real people, one invitation' });
  await scene('m05', '04 · Voice', async () => {
    await scrollTo(0, 800);
    await click('css:nav[aria-label="Main navigation"] button', { after: 1300 });
    const input = await type('css:[role="dialog"] input', 'Help for my daughter’s college fees', 55);
    submit(input);
    await sleep(3200);
    await closeSheet();
  }, { title: 'Speak, don’t type' });
  await scene('m06', '05 · Eligibility', async () => {
    await go('/eligibility');
    await answerEligibility();
  }, { title: 'One question per screen', pad: 300 });
  await scene('m07', '05 · Results', async () => {
    await sleep(1600);
    await scrollBy(600, 2000);
  }, { title: 'Lead with the money' });
  await scene('m08', '06 · Scheme', async () => {
    await go('/schemes/pm-jay');
    await sleep(1000);
    await scrollBy(700, 2400);
  }, { title: 'Action within reach' });
  await scene('m09', '07 · Papers', async () => {
    await go('/documents');
    await sleep(900);
    await click('Scan paper', { after: 1000 });
    await click('Take photo', { after: 3600 });
    await closeSheet();
  }, { title: 'Check papers at home' });
  await scene('m10', '08 · Apply', async () => {
    await go('/csc-slip');
    await sleep(900);
    await scrollBy(650, 2400);
  }, { title: 'The fee, in writing' });
  await scene('m11', '09 · Track', async () => {
    await go('/tracker');
    await sleep(800);
    await scrollBy(450, 1800);
  }, { title: 'No more black box' });
  await scene('m12', '10 · Family', async () => {
    await go('/profile');
    await sleep(900);
    await scrollBy(300, 1200);
  }, { title: 'One phone, whole family' });
  await scene('m13', '11 · Comfort', async () => {
    await scrollTo(0, 600);
    await click('css:button[aria-label="Reading comfort settings"]', { after: 900 });
    await click('Sunlight mode', { after: 1700 });
    await click('Sunlight mode', { after: 500 });
    const radios = await waitFor(() => [...D().querySelectorAll('[role="dialog"] [role="radio"]')]);
    if (radios) {
      await click(radios[2], { after: 1300 });
      await click(radios[0], { after: 500 });
    }
    await closeSheet();
  }, { title: 'Readable in the sun' });
  await scene('m14', '12 · Languages', async () => {
    await go('/home');
    await click('css:button[aria-label^="Change language"]', { after: 900 });
    await click('css:button[lang="ta"]', { after: 2300 });
    await click('css:header button[aria-label*="தமிழ்"]', { after: 900, timeout: 2000 });
    await click('css:button[lang="bn"]', { after: 2300 });
  }, { title: 'Every word, your language' });
  await showCard(CARDS.outro);
  await scene('m15', '', null, { pad: 2500 });
}

await sleep(400);
if (MOBILE) await mobile();
else await desktop();
log('STAGE_DONE', Date.now());
