import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ====== Ajustes rápidos ====== */
const MAX_YAW = 0.75, MAX_PITCH = 0.45;    // giro máximo de la cabeza (radianes)
const FOLLOW = 0.12;                       // suavidad del seguimiento
const INVERT_PITCH = false;                // true si el giro vertical sale al revés
const MESSAGES = ['¡Hola!', '¡Hablemos!']; // globos (se sustituyen según el idioma)
const BUBBLE_EVERY = 9000, BUBBLE_FOR = 3000;
/* ============================= */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const heads = [];

/* opts: src (archivo .glb) · box (elemento que se mide) · fill+fov+spin+start (objetos que giran sobre su eje) */
function createHead(host, canvas, opts = {}){
  const box = opts.box || host, toy = !!opts.fill;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true }); }
  catch (e) { host.classList.add('nogl','ready'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2,3,4); scene.add(key);
  const camera = new THREE.PerspectiveCamera(opts.fov || 30, 1, 0.1, 100);
  const tilt = new THREE.Group(); scene.add(tilt);          // inclinación fija (sensación de flotar)
  if (opts.tilt) { tilt.rotation.x = opts.tilt[0]; tilt.rotation.z = opts.tilt[1]; }
  const pivot = new THREE.Group(); tilt.add(pivot);         // giro sobre el eje propio
  const h = { ready:false, dirty:true, vis:true, tx:0, ty:0, cx:0, cy:0, radius:1, maxDim:1, sa:opts.start || 0, t:performance.now() };

  function fit(){
    if (toy) {   // la dimensión mayor del objeto ocupa "fill" del lienzo (64 de 96 px)
      const d = h.maxDim / opts.fill / (2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));
      camera.position.set(0,0,d); camera.near = d/50; camera.far = d*10; camera.updateProjectionMatrix(); return;
    }
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2*Math.atan(Math.tan(vf/2)*camera.aspect);
    const dist = h.radius / Math.sin(Math.min(vf, hf)/2) * 1.05;
    camera.position.set(0,0,dist); camera.near = dist/50; camera.far = dist*10; camera.updateProjectionMatrix();
  }
  function resize(){
    const w = box.clientWidth, hh = box.clientHeight; if (!w || !hh) return;
    renderer.setSize(w, hh, false); camera.aspect = w/hh; camera.updateProjectionMatrix();
    if (h.ready) fit(); h.dirty = true;
  }
  new ResizeObserver(resize).observe(box); resize();
  if (toy) new IntersectionObserver(es => { h.vis = es[0].isIntersecting; }).observe(host);

  new GLTFLoader().load(opts.src || 'assets/models/cabeza.glb', gltf => {
    const model = gltf.scene; pivot.add(model);   // sin animaciones propias
    const bb = new THREE.Box3().setFromObject(model, true);
    const size = bb.getSize(new THREE.Vector3()), center = bb.getCenter(new THREE.Vector3());
    model.position.sub(center);
    h.radius = Math.max(size.x, size.y, size.z) * 0.5; h.maxDim = h.radius * 2;
    h.ready = true; fit(); h.dirty = true; host.classList.add('ready');
  }, undefined, err => { console.error(err); host.classList.add('nogl','ready'); });

  h.aim = (x, y) => {
    if (toy) return;
    const b = host.getBoundingClientRect(); if (!b.width) return;
    const mx = b.left + b.width/2, my = b.top + b.height/2;
    h.tx = THREE.MathUtils.clamp((x-mx)/(innerWidth*0.5), -1, 1) * MAX_YAW;
    h.ty = THREE.MathUtils.clamp((y-my)/(innerHeight*0.5), -1, 1) * MAX_PITCH * (INVERT_PITCH ? -1 : 1);
  };
  h.step = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - h.t)/1000); h.t = now;
    if (!h.ready || !h.vis || !host.getClientRects().length) return;   // oculto o fuera de pantalla: no dibuja
    if (toy) {
      if (opts.spin) { h.sa += dt*opts.spin; h.dirty = true; }
      pivot.rotation.y = h.sa;
    } else {
      const dx = h.tx - h.cx, dy = h.ty - h.cy;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) { h.cx += dx*FOLLOW; h.cy += dy*FOLLOW; h.dirty = true; }
      pivot.rotation.y = h.cx; pivot.rotation.x = h.cy;
    }
    if (!h.dirty) return;
    renderer.render(scene, camera); h.dirty = false;
  };
  heads.push(h);
}

const link = document.getElementById('clippy'), bubble = document.getElementById('bubble');
createHead(link, document.getElementById('c'));                                  // botón flotante
createHead(document.getElementById('head3d'), document.getElementById('c2'));    // cabeza de la página de contacto

// Objetos de "Sobre mí": giran lentamente sobre su eje; el globo sale con CSS al pasar el cursor
document.querySelectorAll('.toy').forEach((el, i) => {
  const src = 'assets/models/' + el.dataset.obj + '.glb';
  const cv = el.querySelector('canvas');
  const tl = el.dataset.tilt ? el.dataset.tilt.split(',').map(d => parseFloat(d)*Math.PI/180) : null;
  createHead(el, cv, { src, box:cv, fill:96/144, fov:18, spin: reduceMotion ? 0 : parseFloat(el.dataset.spin), start:i*1.7, tilt:tl });
});

if (!reduceMotion) {
  const go = e => heads.forEach(h => h.aim(e.clientX, e.clientY));
  addEventListener('pointermove', go, { passive:true });
  addEventListener('pointerdown', go, { passive:true });
}
(function tick(){ requestAnimationFrame(tick); heads.forEach(h => h.step()); })();

// Globo de diálogo periódico (solo el botón flotante)
let m = 0;
function showBubble(){
  const ms = window.MSGS || MESSAGES; bubble.textContent = ms[m++ % ms.length];
  link.classList.add('show'); setTimeout(() => link.classList.remove('show'), BUBBLE_FOR);
}
setTimeout(() => { showBubble(); setInterval(showBubble, BUBBLE_EVERY); }, 1500);
