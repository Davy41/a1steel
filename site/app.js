// Products, catalogue picker, calculator, contact links, menu, quote form,
// the molten pour line, and deferred loading of the 3D bundle.

// CONFIRM BEFORE LAUNCH: the live site lists no phone number. Put the real
// sales WhatsApp/phone number here (international format, digits only).
const SALES_PHONE = '250788000000';

const waLink = msg => `https://wa.me/${SALES_PHONE}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll('.js-wa').forEach(a => {
  a.href = waLink(a.dataset.msg || 'Hello A1 Iron & Steel');
  a.target = '_blank'; a.rel = 'noopener';
});
document.querySelectorAll('.js-tel').forEach(a => { a.href = 'tel:+' + SALES_PHONE; });

const S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';
// Each icon is the product's real cross-section (or its form, for wire goods)
const icons = {
  tmt: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="9" ${S}/><path d="M9 11l3 2M23 11l-3 2M9 21l3-2M23 21l-3-2" ${S}/></svg>`,
  round: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="9" ${S}/></svg>`,
  rod: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" ${S}/><circle cx="16" cy="16" r="9" ${S} stroke-dasharray="2 3"/></svg>`,
  angle: `<svg viewBox="0 0 32 32"><path d="M8 6v18h18v-4H12V6z" ${S}/></svg>`,
  channel: `<svg viewBox="0 0 32 32"><path d="M23 7H9v18h14v-4h-10V11h10z" ${S}/></svg>`,
  flat: `<svg viewBox="0 0 32 32"><rect x="5" y="13" width="22" height="6" ${S}/></svg>`,
  strip: `<svg viewBox="0 0 32 32"><rect x="4" y="14.5" width="24" height="3" ${S}/></svg>`,
  hollow: `<svg viewBox="0 0 32 32"><rect x="7" y="7" width="18" height="18" rx="2" ${S}/><rect x="10" y="10" width="12" height="12" ${S}/></svg>`,
  nail: `<svg viewBox="0 0 32 32"><path d="M10 7h12M16 7v16l-1.5 3h3L16 23" ${S}/></svg>`,
  binding: `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="10" ry="7" ${S}/><ellipse cx="16" cy="16" rx="6" ry="4" ${S}/></svg>`,
  brc: `<svg viewBox="0 0 32 32"><path d="M6 11h20M6 16h20M6 21h20M11 6v20M16 6v20M21 6v20" ${S}/></svg>`,
  chain: `<svg viewBox="0 0 32 32"><path d="M6 16l5-5 5 5-5 5zM16 16l5-5 5 5-5 5z" ${S}/></svg>`,
  barbed: `<svg viewBox="0 0 32 32"><path d="M4 16h24M12 12l4 8M16 12l-4 8M22 12l-2 8" ${S}/></svg>`,
};

export const products = [
  { id: 'tmt', name: 'TMT Bars', cat: 'Rebar', img: 'products_tmt-bars.jpg', desc: 'High-strength reinforcement bars with corrosion resistance and seismic safety, for columns, slabs and foundations.' },
  { id: 'round', name: 'Round Bar', cat: 'Long', img: 'products_Round-bars.jpg', desc: 'Precision round bars for construction, manufacturing and automotive parts.' },
  { id: 'rod', name: '5.5 mm Wire Rod', cat: 'Long', img: 'products_5.5mm.webp', desc: 'General-purpose wire rod with consistent mechanical properties, ready for drawing into wire and nails.' },
  { id: 'angle', name: 'V Angle', cat: 'Section', img: 'products_V-ANGLES.jpg', desc: 'Equal angles for frames, trusses, towers and structural connections.' },
  { id: 'channel', name: 'C Channel', cat: 'Section', img: 'products_c-channel.jpg', desc: 'MS channels for stable framing, purlins and industrial structures.' },
  { id: 'flat', name: 'Flat Bar', cat: 'Long', img: 'products_Flat-Bars.jpg', desc: 'Flat bars for fabrication, brackets, gates and general manufacturing.' },
  { id: 'strip', name: 'Hot Rolled Strip', cat: 'Flat', img: 'products_hot-rolled.png', desc: 'High-strength strip for tube making, automotive, construction and fabrication.' },
  { id: 'hollow', name: 'Hollow Section', cat: 'Pipe', img: 'products_HS.jpg', desc: 'Square, rectangular and round hollow sections with a strong strength-to-weight ratio, from our ERW pipe plant.' },
  { id: 'nail', name: 'Wire Nails', cat: 'Wire', img: 'products_Wire-Nails-1.avif', desc: 'MS wire nails with a firm grip for roofing, formwork and carpentry.' },
  { id: 'binding', name: 'Binding Wire', cat: 'Wire', img: 'products_Binding-Wire-1.jpg', desc: 'Annealed binding wire for tying rebar on site and general fastening.' },
  { id: 'brc', name: 'BRC Mesh', cat: 'Rebar', img: 'products_brc.jpg', desc: 'Welded reinforcement mesh for slabs, floors and precast concrete.' },
  { id: 'chain', name: 'GI Chain Link', cat: 'Fencing', img: 'products_gi-chain-link.jpg', desc: 'Galvanised chain-link fencing for homes, schools, farms and industrial sites.' },
  { id: 'barbed', name: 'Barbed Wire', cat: 'Fencing', img: 'products_barbed-wires.jpg', desc: 'Long-lasting barbed wire for perimeter security.' },
];

/* ---------- catalogue ---------- */
const list = document.getElementById('prodList');
const img = document.getElementById('prodImg');
const nameEl = document.getElementById('prodName');
const descEl = document.getElementById('prodDesc');
const priceBtn = document.getElementById('prodPrice');
const sheetBtn = document.getElementById('prodSheet');
const select = document.getElementById('f-product');

list.innerHTML = products.map(p => `
  <li class="prod-opt" role="option" id="opt-${p.id}" data-id="${p.id}" tabindex="-1" aria-selected="false">
    ${icons[p.id]}<span>${p.name}</span><span class="cat">${p.cat}</span>
  </li>`).join('');
select.innerHTML = '<option value="">Choose a product</option>' + products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

let current = null;
export function selectProduct(id, { focus = false } = {}) {
  const p = products.find(x => x.id === id);
  if (!p || current === id) return;
  current = id;
  list.querySelectorAll('.prod-opt').forEach(el => {
    const on = el.dataset.id === id;
    el.setAttribute('aria-selected', on);
    el.tabIndex = on ? 0 : -1;
    if (on && focus) el.focus();
  });
  list.setAttribute('aria-activedescendant', 'opt-' + id);
  img.classList.add('swap');
  const next = new Image();
  next.onload = next.onerror = () => {
    img.src = next.src; img.alt = p.name;
    requestAnimationFrame(() => img.classList.remove('swap'));
  };
  next.src = 'img/' + p.img;
  nameEl.textContent = p.name;
  descEl.textContent = p.desc;
  priceBtn.href = waLink(`Hello A1 Iron & Steel, what is today's price for ${p.name}? Size: , quantity: , delivery to: `);
  sheetBtn.href = waLink(`Hello A1 Iron & Steel, please send the ${p.name} datasheet.`);
  for (const b of [priceBtn, sheetBtn]) { b.target = '_blank'; b.rel = 'noopener'; }
  select.value = id;
}
selectProduct('tmt');

list.addEventListener('click', e => {
  const li = e.target.closest('.prod-opt');
  if (!li) return;
  selectProduct(li.dataset.id, { focus: true });
  // on one-column layouts the photo sits above the list: bring it into view
  if (matchMedia('(max-width: 960px)').matches) document.getElementById('prodView').scrollIntoView({ behavior: 'smooth' });
});
list.addEventListener('keydown', e => {
  const i = products.findIndex(p => p.id === current);
  let n = null;
  if (e.key === 'ArrowDown') n = Math.min(products.length - 1, i + 1);
  if (e.key === 'ArrowUp') n = Math.max(0, i - 1);
  if (e.key === 'Home') n = 0;
  if (e.key === 'End') n = products.length - 1;
  if (n !== null) { e.preventDefault(); selectProduct(products[n].id, { focus: true }); }
});
// let the 3D bundle open a product
window.addEventListener('a1:product', e => {
  selectProduct(e.detail);
  document.getElementById('products').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

/* ---------- rebar calculator ---------- */
// Nominal mass of steel bar: kg/m = d² / 162 (d in mm), the standard rule.
const cDia = document.getElementById('c-dia');
const cLen = document.getElementById('c-len');
const cQty = document.getElementById('c-qty');
const calcWa = document.getElementById('calcWa');
const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
function calc() {
  const d = +cDia.value;
  const len = Math.max(0, +cLen.value || 0);
  const qty = Math.max(0, Math.round(+cQty.value || 0));
  const perM = (d * d) / 162;
  const perBar = perM * len;
  const total = perBar * qty;
  document.getElementById('o-m').textContent = fmt(perM, 3);
  document.getElementById('o-bar').textContent = fmt(perBar, 2);
  document.getElementById('o-total').textContent = fmt(total);
  document.querySelector('.out-main dt').textContent = `Total weight, ${fmt(total / 1000, 2)} tonnes`;
  document.getElementById('o-tonne').textContent = perBar ? fmt(1000 / perBar) : '–';
  calcWa.href = waLink(`Hello A1 Iron & Steel, I need ${qty} TMT bars, ${d} mm × ${len} m (about ${fmt(total)} kg). Please send a price. Delivery to: `);
  calcWa.target = '_blank'; calcWa.rel = 'noopener';
}
[cDia, cLen, cQty].forEach(el => el.addEventListener('input', calc));
document.getElementById('calcForm').addEventListener('submit', e => e.preventDefault());
calc();

/* ---------- 3D bundle: poster first, WebGL only when it's worth it ---------- */
(function load3D() {
  const saveData = navigator.connection?.saveData;
  const slow = /(^|-)2g$/.test(navigator.connection?.effectiveType || '');
  const motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl = false;
  try { gl = !!document.createElement('canvas').getContext('webgl2'); } catch (_) {}
  if (saveData || slow || motionOff || !gl) return; // poster stays
  const go = () => import('./pipes.js');
  const idle = window.requestIdleCallback || (f => setTimeout(f, 600));
  if (document.readyState === 'complete') idle(go);
  else window.addEventListener('load', () => idle(go), { once: true });
})();

/* ---------- mobile contact bar: stick to the bottom edge people actually see ---------- */
(function pinFastbar() {
  const bar = document.querySelector('.fastbar');
  const vv = window.visualViewport;
  if (!bar || !vv) return;
  const update = () => {
    // distance between the visible bottom edge and the layout viewport's bottom:
    // >0 when a toolbar has collapsed, <0 when browser chrome covers the bottom
    const below = vv.offsetTop + vv.height - window.innerHeight;
    // a large gap above means the on-screen keyboard is up: tuck the bar away
    const keyboard = below < -150 && vv.scale <= 1.01;
    bar.classList.toggle('kb', keyboard);
    bar.style.setProperty('--bar-shift', (keyboard ? 0 : Math.round(below)) + 'px');
  };
  vv.addEventListener('resize', update);
  vv.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
})();

/* ---------- menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const links = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? 'Close' : 'Menu';
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A' && links.classList.contains('open')) menuBtn.click();
});

/* ---------- quote form (prototype: not connected) ---------- */
const form = document.getElementById('quote');
const status = document.getElementById('formStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  let firstBad = null;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.setAttribute('aria-invalid', bad);
    if (bad && !firstBad) firstBad = f;
  });
  if (firstBad) {
    status.textContent = `Add your ${firstBad.labels[0].textContent.toLowerCase()} to send the request`;
    firstBad.focus();
    return;
  }
  status.textContent = 'Request sent. Our sales team replies within 24 hours.';
  form.reset();
});

/* ---------- molten pour ---------- */
const svg = document.getElementById('pour');
const paths = ['pourHalo', 'pourCore', 'pourFlow'].map(id => document.getElementById(id));
const cool = document.getElementById('pourCool');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let L = 0;

function buildPour() {
  const W = document.documentElement.clientWidth;
  // Measure the page by its footer, not scrollHeight: scrollHeight includes
  // this SVG, so it could never shrink when the layout gets shorter.
  const H = pageBottom();
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.height = H + 'px';

  const wrapW = Math.min(1240, W);
  const side = Math.max(12, (W - wrapW) / 2);
  const right = W - side * 0.5 - (W > 1300 ? 0 : 4);
  const sway = Math.min(28, side * 0.35);

  // Waypoints: falls from a ladle above the hero, then runs down the right
  // margin, swaying a little at each section boundary so it never crosses text.
  const secs = [...document.querySelectorAll('main > section')].map(s => s.offsetTop + s.offsetHeight);
  const pts = [[W > 960 ? W * 0.78 : right, -40], [right, secs[0] * 0.55]];
  secs.forEach((y, i) => pts.push([i % 2 ? right : right - sway, y]));
  pts.push([pts[pts.length - 1][0], H]);

  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const k = (y1 - y0) * 0.5;
    d += ` C${x0},${y0 + k} ${x1},${y1 - k} ${x1},${y1}`;
  }
  [...paths, cool].forEach(p => p.setAttribute('d', d));
  L = paths[0].getTotalLength();
  onScroll();
}

// The pour reaches as far as you've scrolled. The last stretch before the
// head is hot; everything behind it has cooled to dark steel.
let head = 0, hotStart = 0;
function pageBottom() {
  const f = document.querySelector('.foot');
  return f.offsetTop + f.offsetHeight;
}
function onScroll() {
  if (!L) return;
  const H = pageBottom();
  const y = window.scrollY + window.innerHeight * 0.75;
  head = L * Math.min(1, y / H);
  hotStart = Math.max(0, head - window.innerHeight * 1.6);
  cool.style.strokeDasharray = `${head} ${L * 2}`;
  const hot = `0 ${hotStart} ${head - hotStart} ${L * 2}`;
  paths[0].style.strokeDasharray = hot;
  paths[1].style.strokeDasharray = hot;
  if (reduce) paths[2].style.strokeDasharray = '0 ' + L * 2;
  checkFootHeat();
}

/* ---------- footer heat: the pour reaches the footer, it glows, then cools ---------- */
const foot = document.getElementById('foot');
foot.dataset.heat = reduce ? 'cooled' : 'cold';
function checkFootHeat() {
  if (foot.dataset.heat !== 'cold' || !L) return;
  const p = paths[0].getPointAtLength(head);
  if (p.y < foot.offsetTop) return;
  // heat spreads from where the stream lands
  foot.style.setProperty('--hx', (p.x / document.documentElement.clientWidth * 100).toFixed(1) + '%');
  foot.dataset.heat = 'hot';
}
foot.querySelector('.foot-heat').addEventListener('animationend', e => {
  if (e.animationName === 'plate-heat') foot.dataset.heat = 'cooled';
});
foot.addEventListener('click', e => {
  const a = e.target.closest('[data-product]');
  if (a) selectProduct(a.dataset.product);
});

// Bright pulses travel down the hot stretch toward the head
let t = 0;
function flow() {
  const seg = 60, gap = 260;
  t = (t + 3) % (seg + gap);
  let s = `0 ${hotStart + t}`, acc = hotStart + t;
  while (acc + seg < head) { s += ` ${seg} ${gap}`; acc += seg + gap; }
  s += ` 0 ${L * 2}`;
  paths[2].style.strokeDasharray = s;
  requestAnimationFrame(flow);
}

buildPour();
window.addEventListener('scroll', onScroll, { passive: true });
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildPour, 120); });
window.addEventListener('load', buildPour);
document.fonts?.ready.then(buildPour);
if (!reduce) requestAnimationFrame(flow);
