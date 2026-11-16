/*
 * character3d.js - stylized 3D Priyansh at his laptop (Three.js, built from code).
 *
 * Story: types -> notices something -> looks left -> looks right -> spots the visitor
 * -> lifts the headset off and rests it around his neck -> waves hello -> head and
 * eyes follow the cursor / finger.
 *
 *   import { mount } from "./assets/character3d.js";
 *   const c = await mount(document.getElementById("character3d"));
 *   c.replay(); c.pose("wave");
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const COLORS = {
  skin: 0xc58a63, skinDark: 0xa9704d, hair: 0x15100c, beard: 0x231915, brow: 0x17110d,
  blazer: 0x1a2140, shirt: 0x141a33, iris: 0x2d1a10, laptop: 0x4a4e5a, desk: 0x16141d,
  headset: 0x17171d, accent: 0x8b6cff, lips: 0xb06a5c,
};

export async function mount(container, opts = {}) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- renderer / scene / camera ---------------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.style.position = container.style.position || "relative";
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "3D animated Priyansh at his laptop, looking around and waving hello");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 1.9, 7.0);
  camera.lookAt(0, 1.42, 0);

  // lights: soft studio key, purple rim, cool screen light on the face
  scene.add(new THREE.HemisphereLight(0xf2efff, 0x2a2438, 1.35));
  const key = new THREE.DirectionalLight(0xfff1e6, 2.4);
  key.position.set(1.4, 3.2, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 4; key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 4, bottom: -1, near: 0.5, far: 12 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8b6cff, 2.4); rim.position.set(-3, 2.5, -3); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x6ea8ff, 1.2); rim2.position.set(3, 2, -2.5); scene.add(rim2);
  const screenLight = new THREE.PointLight(0x9cc1ff, 0.9, 2.2, 1.8); screenLight.position.set(0, 1.55, 0.35); scene.add(screenLight);

  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, ...o });
  const M = {
    skin: mat(COLORS.skin, { roughness: 0.55 }), skinDark: mat(COLORS.skinDark), hair: mat(COLORS.hair, { roughness: 0.85 }),
    beard: mat(COLORS.beard, { roughness: 0.95 }), brow: mat(COLORS.brow), blazer: mat(COLORS.blazer, { roughness: 0.7 }),
    shirt: mat(COLORS.shirt, { roughness: 0.6 }), white: mat(0xffffff, { roughness: 0.25 }), iris: mat(COLORS.iris, { roughness: 0.2 }),
    laptop: mat(COLORS.laptop, { roughness: 0.35, metalness: 0.6 }), desk: mat(COLORS.desk, { roughness: 0.8 }),
    headset: mat(COLORS.headset, { roughness: 0.45 }), accent: mat(COLORS.accent, { emissive: COLORS.accent, emissiveIntensity: 0.55, roughness: 0.4 }),
    logo: mat(COLORS.accent, { emissive: COLORS.accent, emissiveIntensity: 1.6 }), lips: mat(COLORS.lips),
    glint: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  };
  const add = (parent, geo, material, pos = [0, 0, 0], rot = [0, 0, 0], scl = [1, 1, 1], shadow = true) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos); m.rotation.set(...rot); m.scale.set(...scl);
    m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
  };
  const group = (parent, pos = [0, 0, 0]) => { const g = new THREE.Group(); g.position.set(...pos); parent.add(g); return g; };
  const sphere = (r, w = 32, h = 24) => new THREE.SphereGeometry(r, w, h);
  const capsule = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 16);

  /* ---------------- desk + laptop ---------------- */
  add(scene, new THREE.BoxGeometry(7, 0.3, 2.4), M.desk, [0, -0.15, 0.7], [0, 0, 0], [1, 1, 1], false).receiveShadow = true;
  const laptop = group(scene, [0, 0, 0.55]);
  add(laptop, new THREE.BoxGeometry(1.55, 0.05, 1.0), M.laptop, [0, 0.025, 0]);
  const lid = group(laptop, [0, 0.05, 0.48]);
  lid.rotation.x = 0.2;
  add(lid, new THREE.BoxGeometry(1.55, 1.0, 0.04), M.laptop, [0, 0.5, 0]);
  // glowing shield logo on the back of the lid (faces the camera)
  const logo = group(lid, [0, 0.52, 0.025]);
  const shield = new THREE.Shape();
  shield.moveTo(0, 0.16); shield.lineTo(0.12, 0.11); shield.lineTo(0.12, 0); shield.quadraticCurveTo(0.12, -0.12, 0, -0.17);
  shield.quadraticCurveTo(-0.12, -0.12, -0.12, 0); shield.lineTo(-0.12, 0.11); shield.lineTo(0, 0.16);
  const hole = new THREE.Path(); hole.moveTo(0, 0.13); hole.lineTo(0.095, 0.092); hole.lineTo(0.095, 0); hole.quadraticCurveTo(0.095, -0.095, 0, -0.14);
  hole.quadraticCurveTo(-0.095, -0.095, -0.095, 0); hole.lineTo(-0.095, 0.092); hole.lineTo(0, 0.13); shield.holes.push(hole);
  add(logo, new THREE.ShapeGeometry(shield), M.logo, [0, 0, 0], [0, 0, 0], [1, 1, 1], false);
  add(logo, capsule(0.012, 0.05), M.logo, [-0.03, -0.01, 0.002], [0, 0, 0.8], [1, 1, 1], false);
  add(logo, capsule(0.012, 0.1), M.logo, [0.025, 0.01, 0.002], [0, 0, -0.6], [1, 1, 1], false);

  /* ---------------- body ---------------- */
  const body = group(scene, [0, 0, -0.35]);
  add(body, capsule(0.62, 0.7), M.blazer, [0, 0.55, 0], [0, 0, 0], [1.28, 0.85, 0.68]);
  // shirt V and collar
  const v = new THREE.Shape(); v.moveTo(-0.13, 0.26); v.lineTo(0.13, 0.26); v.lineTo(0, -0.1); v.lineTo(-0.13, 0.26);
  add(body, new THREE.ShapeGeometry(v), M.skin, [0, 1.12, 0.402], [-0.25, 0, 0], [1, 1, 1], false);
  for (const s of [-1, 1]) {
    const flap = new THREE.Shape(); flap.moveTo(0, 0); flap.lineTo(s * 0.24, 0.06); flap.lineTo(s * 0.06, -0.2); flap.lineTo(0, 0);
    add(body, new THREE.ShapeGeometry(flap), M.shirt, [s * 0.04, 1.36, 0.36], [-0.35, 0, 0], [1, 1, 1], false);
  }
  for (const y of [0.98, 0.78, 0.58]) add(body, new THREE.CylinderGeometry(0.022, 0.022, 0.012, 14), M.headset, [0, y, 0.43], [Math.PI / 2 - 0.25, 0, 0], [1, 1, 1], false);
  add(body, new THREE.CylinderGeometry(0.17, 0.19, 0.4, 24), M.skin, [0, 1.42, 0.03]);

  // headset resting around the neck (shown after he takes it off)
  const neckset = group(body, [0, 1.36, 0.03]);
  add(neckset, new THREE.TorusGeometry(0.29, 0.035, 12, 40, Math.PI), M.headset, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  for (const s of [-1, 1]) {
    const cup = group(neckset, [s * 0.29, -0.02, 0.06]);
    cup.rotation.set(-1.2, 0, s * 0.35);
    add(cup, new THREE.CylinderGeometry(0.12, 0.12, 0.09, 28), M.headset);
    add(cup, new THREE.CylinderGeometry(0.085, 0.085, 0.02, 28), M.accent, [0, 0.05, 0]);
  }
  neckset.visible = false;

  /* ---------------- head ---------------- */
  const headPivot = group(body, [0, 1.58, 0.05]);
  const head = group(headPivot, [0, 0, 0]);
  const HC = [0, 0.5, 0]; // head centre
  add(head, sphere(0.5, 48, 40), M.skin, HC, [0, 0, 0], [0.88, 1.12, 0.95]);
  for (const s of [-1, 1]) add(head, sphere(0.1), M.skin, [s * 0.45, 0.5, 0], [0, 0, 0], [0.5, 1, 0.8]);
  // beard: lower front band of a slightly larger sphere, plus moustache
  add(head, new THREE.SphereGeometry(0.508, 48, 32, 0, Math.PI, Math.PI * 0.74, Math.PI * 0.17), M.beard, HC, [0, 0, 0], [0.89, 1.125, 0.96]);
  add(head, capsule(0.014, 0.17), M.beard, [0, 0.345, 0.462], [0, 0, Math.PI / 2], [1, 1, 0.6], false);
  add(head, sphere(0.014, 10, 8), M.beard, [-0.25, 0.43, 0.41], [0, 0, 0], [1, 1, 1], false);
  add(head, sphere(0.022, 12, 10), mat(0xd4a64a, { metalness: 0.9, roughness: 0.25 }), [-0.455, 0.39, 0.06], [0, 0, 0], [1, 1, 1], false);
  // nose
  add(head, capsule(0.048, 0.07), M.skinDark, [0, 0.46, 0.48], [0.35, 0, 0]);
  // mouths (one visible at a time)
  const mouthFlat = add(head, capsule(0.024, 0.11), M.lips, [0, 0.29, 0.462], [0, 0, Math.PI / 2], [1, 1, 0.7], false);
  const mouthSmile = add(head, new THREE.TorusGeometry(0.075, 0.02, 10, 24, Math.PI), M.lips, [0, 0.315, 0.46], [0, 0, Math.PI], [1, 0.9, 1], false);
  const mouthO = add(head, sphere(0.04, 16, 12), M.iris, [0, 0.285, 0.458], [0, 0, 0], [1, 1.25, 0.5], false);
  // eyes
  const eyes = [], irises = [];
  for (const s of [-1, 1]) {
    const eye = group(head, [s * 0.165, 0.57, 0.425]);
    add(eye, sphere(0.088, 24, 18), M.white, [0, 0, 0], [0, 0, 0], [1.05, 0.72, 0.6], false);
    const iris = group(eye, [0, 0, 0.035]);
    add(iris, sphere(0.054, 20, 14), M.iris, [0, 0, 0], [0, 0, 0], [1, 1, 0.55], false);
    add(iris, sphere(0.014, 10, 8), M.glint, [0.015, 0.018, 0.026], [0, 0, 0], [1, 1, 1], false);
    eyes.push(eye); irises.push(iris);
  }
  const brows = [];
  for (const s of [-1, 1]) brows.push(add(head, capsule(0.03, 0.14), M.brow, [s * 0.17, 0.67, 0.462], [0, 0, Math.PI / 2 - s * 0.08], [1, 1, 0.8], false));
  // hair: swept-up volume
  add(head, new THREE.SphereGeometry(0.535, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52), M.hair, [0, 0.52, -0.02], [-0.38, 0, 0], [0.93, 1.12, 1.0]);
  // volume on top and at the back
  const volume = [[0, 1.0, 0.0, 0.34, [1.35, 0.6, 1.15]], [-0.22, 0.95, 0.05, 0.25, [1, 0.75, 1]], [0.24, 0.96, 0.02, 0.25, [1, 0.75, 1]],
                  [0, 0.82, -0.3, 0.4, [1.1, 0.9, 0.9]], [-0.38, 0.72, -0.02, 0.2, [0.7, 1.15, 1]], [0.38, 0.72, -0.02, 0.2, [0.7, 1.15, 1]]];
  for (const [x, y, z, r, sc] of volume) add(head, sphere(r, 28, 20), M.hair, [x, y, z], [0, 0, 0], sc);
  // messy fringe: strands hanging over the forehead down to the brows
  const fringe = [[-0.27, 0.82, 0.33, 0.25], [-0.15, 0.8, 0.39, -0.1], [-0.03, 0.78, 0.42, 0.18], [0.09, 0.79, 0.41, -0.25], [0.2, 0.81, 0.37, 0.12], [0.3, 0.85, 0.3, -0.3],
                  [-0.08, 0.88, 0.38, 0.4], [0.14, 0.9, 0.36, -0.45], [0.02, 0.95, 0.3, 0.1]];
  for (const [x, y, z, rz] of fringe) add(head, capsule(0.045, 0.2), M.hair, [x, y - 0.02, z + 0.01], [0.42, 0, rz], [1, 1, 0.5]);
  // a few flyaway tufts on top
  for (const [x, y, z, rz] of [[-0.12, 1.16, 0.05, 0.6], [0.1, 1.17, 0.0, -0.5], [0.28, 1.08, 0.05, -1.0], [-0.3, 1.06, 0.05, 1.0]])
    add(head, capsule(0.035, 0.1), M.hair, [x, y, z], [0, 0, rz]);
  // headset on the head
  const headset = group(head, [0, 0.5, 0]);
  add(headset, new THREE.TorusGeometry(0.5, 0.04, 12, 48, Math.PI), M.headset, [0, 0.02, 0], [0, 0, 0], [1.06, 1.24, 1]);
  add(headset, new THREE.TorusGeometry(0.5, 0.012, 8, 48, Math.PI), M.accent, [0, 0.02, 0.038], [0, 0, 0], [1.06, 1.24, 1], false);
  for (const s of [-1, 1]) {
    const cup = group(headset, [s * 0.5, 0, 0]);
    cup.rotation.z = Math.PI / 2;
    add(cup, new THREE.CylinderGeometry(0.15, 0.15, 0.1, 30), M.headset);
    add(cup, new THREE.CylinderGeometry(0.105, 0.105, 0.02, 30), M.accent, [0, s * -0.055, 0]);
  }
  const micCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.52, -0.05, 0.05), new THREE.Vector3(-0.47, -0.25, 0.3), new THREE.Vector3(-0.18, -0.24, 0.47)]);
  add(headset, new THREE.TubeGeometry(micCurve, 20, 0.016, 8), M.headset);
  add(headset, sphere(0.035, 12, 10), M.headset, [-0.17, -0.24, 0.48]);

  headPivot.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });

  /* ---------------- arms (shoulder -> elbow -> hand) ---------------- */
  function makeArm(side) {
    const shoulder = group(body, [side * 0.7, 1.12, 0.02]);
    add(shoulder, capsule(0.17, 0.42), M.blazer, [0, -0.3, 0]);
    const elbow = group(shoulder, [0, -0.6, 0]);
    add(elbow, capsule(0.145, 0.36), M.blazer, [0, -0.26, 0]);
    add(elbow, new THREE.CylinderGeometry(0.15, 0.15, 0.06, 20), M.headset, [0, -0.5, 0]);
    const hand = group(elbow, [0, -0.6, 0]);
    add(hand, sphere(0.13, 24, 18), M.skin, [0, 0, 0], [0, 0, 0], [0.9, 1.1, 0.7]);
    add(hand, capsule(0.04, 0.08), M.skin, [side * -0.11, 0.03, 0.03], [0, 0, side * 0.9]);
    for (let i = 0; i < 4; i++) add(hand, capsule(0.029, 0.1 - Math.abs(i - 1.5) * 0.018), M.skin, [-0.066 + i * 0.044, -0.15, 0.01], [0, 0, (i - 1.5) * 0.08]);
    return { shoulder, elbow, hand };
  }
  const armL = makeArm(-1), armR = makeArm(1); // L = his right hand (viewer's left)

  /* ---------------- HTML overlays: "!" and speech bubble ---------------- */
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:absolute;inset:0;pointer-events:none;font-family:'Inter Tight',Arial,sans-serif";
  overlay.innerHTML = '<div data-alert style="position:absolute;left:62%;top:6%;font-weight:900;font-size:clamp(28px,5vw,54px);color:#fbbf24;opacity:0;transform:translateY(10px);transition:opacity .25s,transform .25s;text-shadow:0 4px 18px rgba(0,0,0,.6)">!</div>' +
    '<div data-bubble style="position:absolute;right:4%;top:7%;background:#f4f4f6;color:#0a0a0d;font-weight:800;font-size:clamp(14px,1.8vw,21px);padding:12px 18px;border-radius:20px;box-shadow:0 18px 40px -16px rgba(0,0,0,.7);opacity:0;transform:scale(.6);transform-origin:10% 100%;transition:opacity .3s,transform .4s cubic-bezier(.2,1.4,.5,1)">Hi, visitor! &#128075;<i style="position:absolute;left:18px;bottom:-9px;width:18px;height:18px;background:#f4f4f6;transform:rotate(45deg);border-radius:3px"></i></div>';
  container.appendChild(overlay);
  const alertEl = overlay.querySelector("[data-alert]"), bubbleEl = overlay.querySelector("[data-bubble]");
  const showAlert = (on) => { alertEl.style.opacity = on ? 1 : 0; alertEl.style.transform = on ? "none" : "translateY(10px)"; };
  const showBubble = (on) => { bubbleEl.style.opacity = on ? 1 : 0; bubbleEl.style.transform = on ? "scale(1)" : "scale(.6)"; };

  /* ---------------- poses ---------------- */
  const P = {
    // arms resting on the keyboard
    typeL: { s: [-0.62, 0, 0.3], e: [-1.05, 0, 0.3] },
    typeR: { s: [-0.62, 0, -0.3], e: [-1.05, 0, -0.3] },
    // his right hand up at the ear, holding the headset
    liftL: { s: [0.2, 0, -2.62], e: [0, 0, -1.41] },
    // his left arm raised to wave
    waveR: { s: [0.15, 0, 2.09], e: [0, 0, 1.05] },
    downL: { s: [0.05, 0, -0.08], e: [-0.2, 0, 0] },
    downR: { s: [0.05, 0, 0.08], e: [-0.2, 0, 0] },
  };
  const setArm = (arm, p) => { arm.shoulder.rotation.set(...p.s); arm.elbow.rotation.set(...p.e); };
  const look = { y: 0, x: 0.12, tilt: 0, ix: 0, iy: -0.012 }; // head yaw/pitch/roll + iris offset
  function applyLook() {
    headPivot.rotation.set(look.x, look.y, look.tilt);
    for (const i of irises) i.position.set(look.ix, look.iy, 0.035);
  }
  function mouth(which) { mouthFlat.visible = which === "flat"; mouthSmile.visible = which === "smile"; mouthO.visible = which === "o"; }
  function brow(lift) { brows.forEach((b) => (b.position.y = 0.67 + lift)); }

  /* ---------------- tiny tween engine (driven by the render loop) ---------------- */
  let tweens = [], clock = 0, runId = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const back = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  function tween(targets, ms, fn = ease) {
    // targets: [[object, key, toValue], ...]
    return new Promise((res) => {
      const from = targets.map(([o, k]) => o[k]);
      tweens.push({ targets, from, t0: clock, ms: reduce ? 0.01 : ms, fn, res, id: runId });
    });
  }
  const sleep = (ms) => tween([], ms);
  const armTargets = (arm, p) => [[arm.shoulder.rotation, "x", p.s[0]], [arm.shoulder.rotation, "y", p.s[1]], [arm.shoulder.rotation, "z", p.s[2]],
    [arm.elbow.rotation, "x", p.e[0]], [arm.elbow.rotation, "y", p.e[1]], [arm.elbow.rotation, "z", p.e[2]]];
  const lookTargets = (t) => Object.keys(t).map((k) => [look, k, t[k]]);

  let typing = true, follow = false, blinkT = 2.5, waving = false;

  function reset(name) {
    tweens.forEach((tw) => tw.res()); tweens = [];
    typing = false; follow = false; waving = false;
    headset.visible = true; headset.position.set(0, 0.5, 0); headset.rotation.set(0, 0, 0); headset.scale.set(1, 1, 1);
    neckset.visible = false; neckset.position.y = 1.36;
    setArm(armL, P.typeL); setArm(armR, P.typeR); armL.hand.rotation.set(0, 0, 0); armR.hand.rotation.set(0, 0, 0);
    Object.assign(look, { y: 0, x: 0.12, tilt: 0, ix: 0, iy: -0.012 }); applyLook();
    mouth("flat"); brow(0); showAlert(false); showBubble(false); screenLight.intensity = 0.9;
  }

  async function play() {
    const my = ++runId; const ok = () => my === runId && alive;
    reset();
    if (reduce) { pose("final"); return; }
    typing = true;
    await sleep(2600); if (!ok()) return;                       // 1. working
    typing = false; setArm(armL, P.typeL); setArm(armR, P.typeR);
    brow(0.03); showAlert(true);                                // 2. notices something
    await tween(lookTargets({ x: 0, iy: 0 }), 380); if (!ok()) return;
    await sleep(450); if (!ok()) return; showAlert(false);
    await tween(lookTargets({ y: -0.5, tilt: 0.05, ix: -0.022 }), 560); if (!ok()) return;   // 3. looks left
    await sleep(650); if (!ok()) return;
    await tween(lookTargets({ y: 0.5, tilt: -0.05, ix: 0.022 }), 760); if (!ok()) return;   // 4. looks right
    await sleep(650); if (!ok()) return;
    await tween(lookTargets({ y: 0, tilt: 0, ix: 0, iy: 0.004 }), 420); if (!ok()) return;   // 5. spots the visitor
    mouth("o"); brow(0.05); blinkT = 0;
    await sleep(600); if (!ok()) return;
    // 6. headset off: his right hand to the ear, lift, drop to the neck
    await tween(armTargets(armL, P.liftL), 650); if (!ok()) return;
    await tween([[headset.position, "y", 0.72], [headset.rotation, "z", 0.12]], 420); if (!ok()) return;
    await tween([[headset.position, "y", -0.25], [headset.scale, "x", 0.6], [headset.scale, "y", 0.6], [headset.scale, "z", 0.6]], 360, (t) => t * t); if (!ok()) return;
    headset.visible = false; neckset.visible = true; neckset.position.y = 1.5;
    tween([[neckset.position, "y", 1.36]], 420, back);
    await tween(armTargets(armL, P.downL), 520); if (!ok()) return;
    mouth("smile"); brow(0.02);
    // 7. wave hello
    await tween(armTargets(armR, P.waveR), 560, back); if (!ok()) return;
    showBubble(true); waving = true;
    await sleep(1900); if (!ok()) return;
    waving = false; armR.hand.rotation.z = 0;
    await tween(armTargets(armR, P.downR), 520); if (!ok()) return;
    tween(armTargets(armL, P.typeL), 500); tween(armTargets(armR, P.typeR), 500);
    setTimeout(() => { if (ok()) showBubble(false); }, 2200);
    follow = true;                                               // 8. follow the cursor
  }

  function pose(name) {
    runId++; reset();
    const L = { work: { x: 0.12, iy: -0.012 }, left: { x: 0, y: -0.5, tilt: 0.05, ix: -0.022, iy: 0 }, right: { x: 0, y: 0.5, tilt: -0.05, ix: 0.022, iy: 0 } };
    Object.assign(look, L[name] || { x: 0, y: 0, tilt: 0, ix: 0, iy: 0.004 }); applyLook();
    if (name === "work") typing = true;
    if (name === "notice") { showAlert(true); brow(0.05); mouth("o"); }
    if (name === "lift") { setArm(armL, P.liftL); headset.position.y = 0.72; headset.rotation.z = 0.12; mouth("o"); }
    if (name === "wave" || name === "final") { headset.visible = false; neckset.visible = true; mouth("smile"); setArm(armL, P.downL); }
    if (name === "wave") { setArm(armR, P.waveR); showBubble(true); waving = true; }
    if (name === "final") { showBubble(true); follow = true; }
  }

  /* ---------------- cursor / finger follow ---------------- */
  const target = { x: 0, y: 0 }; let hasPointer = false;
  function onPoint(cx, cy) {
    const r = renderer.domElement.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (innerWidth * 0.45)));
    target.y = Math.max(-1, Math.min(1, (cy - (r.top + r.height * 0.32)) / (innerHeight * 0.55)));
    hasPointer = true;
  }
  const pm = (e) => onPoint(e.clientX, e.clientY);
  const tm = (e) => { if (e.touches && e.touches[0]) onPoint(e.touches[0].clientX, e.touches[0].clientY); };
  addEventListener("pointermove", pm, { passive: true });
  addEventListener("touchmove", tm, { passive: true });

  /* ---------------- resize + render loop ---------------- */
  function resize() {
    const w = container.clientWidth || 600, h = container.clientHeight || Math.round(w * 0.95);
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  let alive = true, visible = true, last = performance.now();
  const vio = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.01 });
  vio.observe(container);

  function frame(now) {
    if (!alive) return;
    requestAnimationFrame(frame);
    const dt = Math.min(64, now - last); last = now;
    if (!visible || document.hidden) return;
    clock += dt;
    // tweens
    for (const tw of tweens.slice()) {
      const k = Math.min(1, (clock - tw.t0) / tw.ms), e = tw.fn(k);
      tw.targets.forEach(([o, key, to], i) => (o[key] = tw.from[i] + (to - tw.from[i]) * e));
      if (k >= 1) { tweens.splice(tweens.indexOf(tw), 1); tw.res(); }
    }
    const t = clock / 1000;
    if (typing) {
      armL.elbow.rotation.x = P.typeL.e[0] + Math.sin(t * 18) * 0.05;
      armR.elbow.rotation.x = P.typeR.e[0] + Math.sin(t * 18 + 1.7) * 0.05;
      body.position.y = Math.sin(t * 2.2) * 0.008;
      screenLight.intensity = 0.75 + Math.random() * 0.35;
    }
    if (waving) armR.hand.rotation.z = Math.sin(t * 11) * 0.45;
    // breathing
    body.scale.y = 1 + Math.sin(t * 1.8) * 0.006;
    // blink
    blinkT -= dt / 1000;
    const b = blinkT < 0 && blinkT > -0.16 ? 1 - Math.sin((-blinkT / 0.16) * Math.PI) : 1;
    eyes.forEach((e) => (e.scale.y = Math.max(0.08, b)));
    if (blinkT < -0.16) blinkT = 2.5 + Math.random() * 2.5;
    // follow the cursor
    if (follow && hasPointer) {
      const k = 1 - Math.pow(0.88, dt / 16);
      look.y += (target.x * 0.55 - look.y) * k;
      look.x += (target.y * 0.28 - look.x) * k;
      look.tilt += (-target.x * 0.06 - look.tilt) * k;
      look.ix += (target.x * 0.022 - look.ix) * k;
      look.iy += (-target.y * 0.016 - look.iy) * k;
    }
    applyLook();
    renderer.render(scene, camera);
  }
  reset(); typing = true;
  requestAnimationFrame(frame);

  // start the story when it first comes into view
  let started = false;
  const sio = new IntersectionObserver((es) => { if (es[0].isIntersecting && !started) { started = true; play(); sio.disconnect(); } }, { threshold: 0.3 });
  if (opts.autoplay === false) started = true; else sio.observe(container);

  return {
    replay() { started = true; play(); },
    pose(name) { started = true; pose(name); },
    destroy() {
      alive = false; ro.disconnect(); vio.disconnect(); sio.disconnect();
      removeEventListener("pointermove", pm); removeEventListener("touchmove", tm);
      renderer.dispose(); container.innerHTML = "";
    },
  };
}
