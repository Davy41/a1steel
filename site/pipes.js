// Interactive 3D bundle of A1 products: drag to turn, hover to name, click to open.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('pipes');
const tag = document.getElementById('pipeTag');
const stage = canvas.parentElement;
canvas.hidden = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0.4, 11);

scene.add(new THREE.HemisphereLight(0xcfd8e3, 0x1a1d21, 0.6));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(4, 6, 5);
scene.add(key);
// heat from the glowing end
const heatLight = new THREE.PointLight(0xff8a2a, 18, 6, 2);
scene.add(heatLight);

/* ---------- materials ---------- */
const steel = () => new THREE.MeshStandardMaterial({ color: 0x8e979f, metalness: 1, roughness: 0.32 });
const millScale = () => new THREE.MeshStandardMaterial({ color: 0x4b4f54, metalness: 0.9, roughness: 0.55 });
const galvanised = () => new THREE.MeshStandardMaterial({ color: 0xb9c1c8, metalness: 1, roughness: 0.22 });

/* ---------- section shapes (extruded along their length) ---------- */
function ring(r, t) {
  const s = new THREE.Shape(); s.absarc(0, 0, r, 0, Math.PI * 2);
  const h = new THREE.Path(); h.absarc(0, 0, r - t, 0, Math.PI * 2, true);
  s.holes.push(h); return s;
}
function box(w, h, t, rad = 0.06) {
  const rr = (x, y, w, h, r, path) => {
    path.moveTo(x + r, y); path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r); path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
  };
  const s = new THREE.Shape(); rr(-w / 2, -h / 2, w, h, rad, s);
  const hole = new THREE.Path(); rr(-w / 2 + t, -h / 2 + t, w - 2 * t, h - 2 * t, rad * 0.5, hole);
  s.holes.push(hole); return s;
}
function channel(w, h, t) {
  const s = new THREE.Shape();
  s.moveTo(w / 2, -h / 2); s.lineTo(-w / 2, -h / 2); s.lineTo(-w / 2, h / 2); s.lineTo(w / 2, h / 2);
  s.lineTo(w / 2, h / 2 - t); s.lineTo(-w / 2 + t, h / 2 - t); s.lineTo(-w / 2 + t, -h / 2 + t); s.lineTo(w / 2, -h / 2 + t);
  s.closePath(); return s;
}
function angle(a, t) {
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(a, 0); s.lineTo(a, t); s.lineTo(t, t); s.lineTo(t, a); s.lineTo(0, a); s.closePath();
  return s;
}
function extrude(shape, len) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: len, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 48 });
  g.translate(0, 0, -len / 2);
  return g;
}
// rebar: core bar plus two helical ribs and longitudinal ribs
function rebar(r, len) {
  const grp = new THREE.Group();
  const mat = millScale();
  const core = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 40, 1), mat);
  core.rotation.x = Math.PI / 2; grp.add(core);
  const turns = len / 0.22;
  for (const phase of [0, Math.PI]) {
    const pts = [];
    for (let i = 0; i <= turns * 24; i++) {
      const a = (i / 24) * Math.PI * 2 + phase;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -len / 2 + (i / (turns * 24)) * len));
    }
    const rib = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.floor(turns * 24), r * 0.13, 6), mat);
    grp.add(rib);
  }
  for (const a of [Math.PI / 2, -Math.PI / 2]) {
    const lr = new THREE.Mesh(new THREE.BoxGeometry(r * 0.22, r * 0.22, len), mat);
    lr.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); grp.add(lr);
  }
  return grp;
}

/* ---------- the bundle ---------- */
const bundle = new THREE.Group();
scene.add(bundle);
const pieces = [];
function add(obj, { id, label, note, x, y, z = 0 }) {
  obj.position.set(x, y, z);
  obj.userData = { id, label, note };
  obj.traverse(m => { if (m.isMesh) m.userData.piece = obj; });
  bundle.add(obj); pieces.push(obj);
  return obj;
}

const L = 6.4;
// round pipe with a white-hot end, fresh from the ERW plant
const pipe = add(new THREE.Mesh(extrude(ring(0.62, 0.09), L), galvanised()),
  { id: 'hollow', label: 'Round hollow section', note: 'ERW pipe plant', x: -0.2, y: 0.55, z: 0.2 });
add(new THREE.Mesh(extrude(box(1.0, 1.0, 0.1), L * 0.92), steel()),
  { id: 'hollow', label: 'Square hollow section', note: 'ERW pipe plant', x: 1.05, y: -0.45, z: -0.5 });
add(rebar(0.24, L * 1.08),
  { id: 'tmt', label: 'TMT bar', note: 'TMT bar mill', x: -1.25, y: -0.55, z: 0.35 });
add(rebar(0.2, L * 1.02),
  { id: 'tmt', label: 'TMT bar', note: 'TMT bar mill', x: -0.55, y: -0.85, z: 0.95 });
add(new THREE.Mesh(extrude(channel(0.7, 1.1, 0.1), L * 0.86), steel()),
  { id: 'channel', label: 'C channel', note: 'Structural mill', x: 1.25, y: 0.75, z: 0.3 });
add(new THREE.Mesh(extrude(angle(0.8, 0.1), L * 0.96), millScale()),
  { id: 'angle', label: 'V angle', note: 'Structural mill', x: 0.15, y: -1.35, z: -0.55 });

// glowing cut end on the round pipe
const glowMat = new THREE.MeshStandardMaterial({ color: 0x3a1a08, emissive: 0xff7a1a, emissiveIntensity: 2.2, metalness: 0.4, roughness: 0.5 });
const hotEnd = new THREE.Mesh(new THREE.RingGeometry(0.53, 0.62, 64), glowMat);
hotEnd.position.set(0, 0, L / 2 + 0.014);
pipe.add(hotEnd);
// a short band behind the rim fades from hot to cooled
const bandMat = new THREE.MeshStandardMaterial({ color: 0x5a2a12, emissive: 0xc94a10, emissiveIntensity: 0.9, metalness: 0.8, roughness: 0.4 });
const band = new THREE.Mesh(new THREE.CylinderGeometry(0.625, 0.625, 0.5, 64, 1, true), bandMat);
band.rotation.x = Math.PI / 2; band.position.z = L / 2 - 0.25;
pipe.add(band);

bundle.rotation.set(0.32, -0.62, 0.08);
const base = { x: 0.32, y: -0.62 };

/* ---------- interaction ---------- */
let target = { x: base.x, y: base.y }, vel = 0, dragging = false, last = null, moved = 0;
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let hovered = null;

function pick(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pieces, true)[0];
  return { piece: hit ? hit.object.userData.piece : null, x: e.clientX - r.left, y: e.clientY - r.top };
}
function setHover(p, x, y) {
  if (hovered && hovered !== p) hovered.traverse(m => m.isMesh && m.material !== glowMat && m.material !== bandMat && m.material.emissive?.setHex(0));
  hovered = p;
  if (p) {
    p.traverse(m => m.isMesh && m.material !== glowMat && m.material !== bandMat && m.material.emissive?.setHex(0x0d2340));
    tag.innerHTML = `${p.userData.label}<small>${p.userData.note}</small>`;
    tag.style.left = x + 'px'; tag.style.top = y + 'px'; tag.hidden = false;
  } else tag.hidden = true;
}

canvas.addEventListener('pointerdown', e => {
  dragging = true; moved = 0; last = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging');
});
canvas.addEventListener('pointermove', e => {
  if (dragging) {
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    target.y += dx * 0.008;
    target.x = Math.max(-0.6, Math.min(1.1, target.x + dy * 0.006));
    vel = dx * 0.008;
    last = { x: e.clientX, y: e.clientY };
    tag.hidden = true;
  } else if (e.pointerType === 'mouse') {
    const h = pick(e); setHover(h.piece, h.x, h.y);
    canvas.style.cursor = h.piece ? 'pointer' : 'grab';
  }
});
const end = e => {
  if (!dragging) return;
  dragging = false; canvas.classList.remove('dragging');
  if (moved < 6) {
    const h = pick(e);
    if (h.piece) window.dispatchEvent(new CustomEvent('a1:product', { detail: h.piece.userData.id }));
  }
};
canvas.addEventListener('pointerup', end);
canvas.addEventListener('pointercancel', end);
canvas.addEventListener('pointerleave', () => { if (!dragging) setHover(null); });

// keyboard: canvas is focusable, arrows turn the bundle
canvas.tabIndex = 0;
canvas.addEventListener('keydown', e => {
  const step = 0.2;
  if (e.key === 'ArrowLeft') target.y -= step;
  else if (e.key === 'ArrowRight') target.y += step;
  else if (e.key === 'ArrowUp') target.x = Math.max(-0.6, target.x - step);
  else if (e.key === 'ArrowDown') target.x = Math.min(1.1, target.x + step);
  else return;
  e.preventDefault();
});

/* ---------- sizing + loop ---------- */
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.position.z = w / h < 1 ? 15.5 : 13.5;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

let visible = true;
new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(stage);

const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  if (!dragging) {
    if (!reduce) target.y += 0.06 * dt + vel; // slow idle turn plus inertia
    vel *= 0.92;
  }
  bundle.rotation.y += (target.y - bundle.rotation.y) * 0.12;
  bundle.rotation.x += (target.x - bundle.rotation.x) * 0.12;
  // the hot end breathes slightly, like cooling metal
  const flick = reduce ? 1 : 1 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 5.3) * 0.03;
  glowMat.emissiveIntensity = 2.2 * flick;
  hotEnd.getWorldPosition(tmp);
  heatLight.position.copy(tmp).add(new THREE.Vector3(0, 0, 0.6));
  heatLight.intensity = 18 * flick;
  renderer.render(scene, camera);
  if (!stage.classList.contains('live')) {
    stage.classList.add('live');
    document.getElementById('stageHint').hidden = false;
    document.getElementById('poster').setAttribute('aria-hidden', 'true');
  }
}
frame();

// dev helper: export the current view as the poster image
window.__bundlePoster = (width = 1200, type = 'image/webp', q = 0.8) => {
  const prev = renderer.getPixelRatio();
  renderer.setPixelRatio(width / stage.clientWidth);
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  renderer.render(scene, camera);
  const url = canvas.toDataURL(type, q);
  renderer.setPixelRatio(prev);
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  return url;
};
