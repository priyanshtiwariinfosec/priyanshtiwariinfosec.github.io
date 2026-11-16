/*
 * character.js - animated illustrated Priyansh at his laptop.
 *
 * Story: types on the laptop -> notices something -> looks left -> looks right ->
 * spots the visitor in the centre -> takes the headset off and rests it around
 * his neck -> waves hello -> from then on his head and eyes follow the cursor
 * (or the finger on touch screens).
 *
 * Usage:  <div id="character"></div>
 *         <script src="assets/character.js"></script>
 *         <script>PriyanshCharacter.mount(document.getElementById('character'))</script>
 */
(function (global) {
  "use strict";

  var SVG = '' +
'<svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated illustration of Priyansh at his laptop, looking around and waving hello">' +
'<defs>' +
'  <radialGradient id="pc-bg" cx="50%" cy="38%" r="60%"><stop offset="0" stop-color="#2a2540"/><stop offset=".55" stop-color="#121118"/><stop offset="1" stop-color="#050507" stop-opacity="0"/></radialGradient>' +
'  <linearGradient id="pc-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d39a72"/><stop offset="1" stop-color="#b97a55"/></linearGradient>' +
'  <linearGradient id="pc-suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#243256"/><stop offset="1" stop-color="#141c33"/></linearGradient>' +
'  <linearGradient id="pc-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d48"/><stop offset="1" stop-color="#22242c"/></linearGradient>' +
'  <linearGradient id="pc-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1a24"/><stop offset="1" stop-color="#0b0a10"/></linearGradient>' +
'  <radialGradient id="pc-glow" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#8fb4ff" stop-opacity=".35"/><stop offset="1" stop-color="#8fb4ff" stop-opacity="0"/></radialGradient>' +
'  <clipPath id="pc-faceclip"><path d="M242 150 Q242 104 300 100 Q358 104 358 150 L358 214 Q356 266 300 284 Q244 266 242 214 Z"/></clipPath>' +
'</defs>' +
'<ellipse cx="300" cy="230" rx="290" ry="250" fill="url(#pc-bg)"/>' +

/* ---------- body (moves a little while typing) ---------- */
'<g id="pc-body">' +
'  <path d="M120 560 L136 404 Q148 344 228 322 L300 312 L372 322 Q452 344 464 404 L480 560 Z" fill="url(#pc-suit)"/>' +
'  <path d="M262 318 L300 410 L338 318 L322 314 L300 360 L278 314 Z" fill="#f2f2f4"/>' +
'  <path d="M262 318 L286 372 L272 382 L240 330 Z" fill="#e3e3e8"/><path d="M338 318 L314 372 L328 382 L360 330 Z" fill="#e3e3e8"/>' +
'  <path d="M240 330 L272 382 L258 470 L210 360 Z" fill="#1a2440"/><path d="M360 330 L328 382 L342 470 L390 360 Z" fill="#1a2440"/>' +
'  <path d="M276 268 L324 268 L328 322 Q300 336 272 322 Z" fill="url(#pc-skin)"/>' +
'  <path d="M276 290 Q300 306 324 290 L326 312 Q300 322 274 312 Z" fill="#a86b48" opacity=".55"/>' +

/* headset resting on the neck (hidden until he takes it off) */
'  <g id="pc-neckset" opacity="0">' +
'    <path d="M244 300 Q300 344 356 300" fill="none" stroke="#14141a" stroke-width="11" stroke-linecap="round"/>' +
'    <rect x="226" y="284" width="30" height="44" rx="12" fill="#1b1b22" transform="rotate(-24 241 306)"/>' +
'    <rect x="231" y="290" width="20" height="32" rx="8" fill="#8b6cff" opacity=".85" transform="rotate(-24 241 306)"/>' +
'    <rect x="344" y="284" width="30" height="44" rx="12" fill="#1b1b22" transform="rotate(24 359 306)"/>' +
'    <rect x="349" y="290" width="20" height="32" rx="8" fill="#8b6cff" opacity=".85" transform="rotate(24 359 306)"/>' +
'  </g>' +
'</g>' +

/* ---------- head (turns, nods, follows the cursor) ---------- */
'<g id="pc-head">' +
'  <ellipse cx="236" cy="206" rx="13" ry="20" fill="#c08560"/><ellipse cx="364" cy="206" rx="13" ry="20" fill="#c08560"/>' +
'  <path d="M242 150 Q242 104 300 100 Q358 104 358 150 L358 214 Q356 266 300 284 Q244 266 242 214 Z" fill="url(#pc-skin)"/>' +
'  <rect id="pc-screenglow" x="236" y="96" width="128" height="196" fill="url(#pc-glow)" opacity=".9" clip-path="url(#pc-faceclip)"/>' +
/* beard and moustache */
'  <path d="M244 206 Q248 262 300 284 Q352 262 356 206 Q350 240 334 250 Q318 262 300 262 Q282 262 266 250 Q250 240 244 206 Z" fill="#2c1f19" opacity=".62"/>' +
'  <path d="M276 238 Q300 228 324 238 Q312 236 300 240 Q288 236 276 238 Z" fill="#2c1f19" opacity=".75"/>' +
/* hair: big swept-back volume */
'  <path d="M234 196 Q212 124 244 86 Q270 50 322 46 Q370 46 388 92 Q400 132 374 196 Q372 152 354 134 Q340 124 320 126 Q292 118 268 132 Q248 144 244 196 Z" fill="#17110d"/>' +
'  <path d="M246 84 Q280 40 336 44 Q376 50 386 88 Q366 62 330 58 Q290 56 246 84 Z" fill="#2c211a"/>' +
'  <path d="M262 74 Q300 46 352 62 M272 92 Q310 66 362 82 M300 124 Q316 96 352 104" fill="none" stroke="#33261e" stroke-width="3" stroke-linecap="round"/>' +
'  <path d="M268 132 Q262 152 256 160 Q276 140 294 136 Z" fill="#17110d"/>' +
/* brows */
'  <g id="pc-brows"><path d="M258 168 Q274 160 290 166" fill="none" stroke="#17110d" stroke-width="6" stroke-linecap="round"/>' +
'  <path d="M310 166 Q326 160 342 168" fill="none" stroke="#17110d" stroke-width="6" stroke-linecap="round"/></g>' +
/* eyes */
'  <ellipse cx="274" cy="190" rx="12" ry="7.5" fill="#fff"/><ellipse cx="326" cy="190" rx="12" ry="7.5" fill="#fff"/>' +
'  <g id="pc-pupils"><circle cx="274" cy="190" r="5.2" fill="#3b2418"/><circle cx="326" cy="190" r="5.2" fill="#3b2418"/>' +
'  <circle cx="275.6" cy="188.4" r="1.6" fill="#fff"/><circle cx="327.6" cy="188.4" r="1.6" fill="#fff"/></g>' +
'  <g id="pc-lids"><rect x="260" y="180" width="28" height="20" fill="#c98e69" transform="scale(1 0)" transform-origin="274 181"/>' +
'  <rect x="312" y="180" width="28" height="20" fill="#c98e69" transform="scale(1 0)" transform-origin="326 181"/></g>' +
/* nose and mouth */
'  <path d="M300 196 Q296 214 290 222 Q300 228 310 222" fill="none" stroke="#9a5f3f" stroke-width="3" stroke-linecap="round"/>' +
'  <path id="pc-mouth-flat" d="M286 248 Q300 252 314 248" fill="none" stroke="#7a3e2c" stroke-width="4" stroke-linecap="round"/>' +
'  <path id="pc-mouth-smile" d="M282 245 Q300 262 318 245 Q300 254 282 245 Z" fill="#fff" stroke="#7a3e2c" stroke-width="3.5" stroke-linejoin="round" opacity="0"/>' +
'  <path id="pc-mouth-o" d="M294 248 Q300 242 306 248 Q300 256 294 248 Z" fill="#5a2a1e" opacity="0"/>' +

/* headset on the head */
'  <g id="pc-headset">' +
'    <path d="M226 208 Q222 76 300 70 Q378 76 374 208" fill="none" stroke="#14141a" stroke-width="12" stroke-linecap="round"/>' +
'    <path d="M232 160 Q236 92 300 86" fill="none" stroke="#8b6cff" stroke-width="2.5" opacity=".7"/>' +
'    <rect x="214" y="182" width="30" height="50" rx="13" fill="#1b1b22"/><rect x="219" y="189" width="20" height="36" rx="8" fill="#8b6cff" opacity=".85"/>' +
'    <rect x="356" y="182" width="30" height="50" rx="13" fill="#1b1b22"/><rect x="361" y="189" width="20" height="36" rx="8" fill="#8b6cff" opacity=".85"/>' +
'    <path d="M232 226 Q240 262 276 254" fill="none" stroke="#14141a" stroke-width="5" stroke-linecap="round"/><circle cx="278" cy="254" r="5" fill="#14141a"/>' +
'  </g>' +
'  <text id="pc-alert" x="372" y="96" font-family="Inter Tight, Arial Black, sans-serif" font-weight="900" font-size="46" fill="#fbbf24" opacity="0">!</text>' +
'</g>' +

/* ---------- desk and laptop (in front of the body) ---------- */
'<rect x="0" y="440" width="600" height="120" fill="url(#pc-desk)"/>' +
'<rect x="0" y="438" width="600" height="3" fill="#2e2b3a"/>' +
'<g id="pc-laptop">' +
'  <path d="M180 348 Q180 336 192 336 L408 336 Q420 336 420 348 L428 436 L172 436 Z" fill="url(#pc-lid)"/>' +
'  <g transform="translate(0 16)"><path d="M300 352 L322 360 L322 378 Q322 396 300 406 Q278 396 278 378 L278 360 Z" fill="none" stroke="#8b6cff" stroke-width="3.5" stroke-linejoin="round" opacity=".9"/>' +
'  <path d="M291 378 L298 386 L311 370" fill="none" stroke="#8b6cff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></g>' +
'  <rect x="150" y="436" width="300" height="10" rx="4" fill="#4a4d58"/>' +
'</g>' +

/* hands typing (peek over the laptop base) */
'<g id="pc-hands">' +
'  <g id="pc-tl"><path d="M150 452 Q156 428 186 426 L214 428 Q226 432 222 442 L216 452 Z" fill="#c08560"/><path d="M192 430 L192 444 M202 430 L202 445 M212 432 L211 446" stroke="#9a5f3f" stroke-width="1.6" stroke-linecap="round"/><path d="M118 470 Q130 440 158 438 L162 470 Z" fill="#1a2440"/></g>' +
'  <g id="pc-tr"><path d="M450 452 Q444 428 414 426 L386 428 Q374 432 378 442 L384 452 Z" fill="#c08560"/><path d="M408 430 L408 444 M398 430 L398 445 M388 432 L389 446" stroke="#9a5f3f" stroke-width="1.6" stroke-linecap="round"/><path d="M482 470 Q470 440 442 438 L438 470 Z" fill="#1a2440"/></g>' +
'</g>' +

/* arm that lifts the headset (his right, viewer's left) */
'<g id="pc-armL" opacity="0">' +
'  <path d="M150 560 Q140 420 196 300 L236 316 Q196 420 204 560 Z" fill="url(#pc-suit)"/>' +
'  <ellipse cx="220" cy="292" rx="22" ry="26" fill="#c08560"/>' +
'</g>' +

/* waving arm (his left, viewer's right) */
'<g id="pc-armR" opacity="0">' +
'  <path d="M452 560 Q470 440 452 330 L494 318 Q514 440 504 560 Z" fill="url(#pc-suit)"/>' +
'  <rect x="448" y="318" width="50" height="16" rx="6" fill="#eeeef2"/>' +
'  <g id="pc-hand">' +
'    <path d="M452 320 Q446 270 456 250 Q462 240 468 252 L470 282 L474 230 Q478 218 486 230 L486 278 L494 236 Q500 226 506 238 L502 284 L512 256 Q518 248 522 260 L512 312 Q506 334 478 334 Q456 334 452 320 Z" fill="#c98c66" stroke="#a86b48" stroke-width="2"/>' +
'  </g>' +
'</g>' +

/* speech bubble */
'<g id="pc-bubble" opacity="0">' +
'  <rect x="392" y="40" width="186" height="64" rx="22" fill="#f4f4f6"/>' +
'  <path d="M412 100 L404 124 L432 102 Z" fill="#f4f4f6"/>' +
'  <text x="485" y="80" text-anchor="middle" font-family="Inter Tight, Arial, sans-serif" font-weight="800" font-size="22" fill="#0a0a0d">Hi, visitor! &#128075;</text>' +
'</g>' +
'</svg>';

  function mount(el, opts) {
    opts = opts || {};
    el.innerHTML = SVG;
    var svg = el.querySelector("svg");
    var $ = function (id) { return svg.getElementById ? svg.getElementById(id) : svg.querySelector("#" + id); };
    var head = $("pc-head"), body = $("pc-body"), pupils = $("pc-pupils"), brows = $("pc-brows"),
        headset = $("pc-headset"), neckset = $("pc-neckset"), armL = $("pc-armL"), armR = $("pc-armR"),
        hand = $("pc-hand"), bubble = $("pc-bubble"), alertMark = $("pc-alert"), hands = $("pc-hands"),
        tl = $("pc-tl"), tr = $("pc-tr"), glow = $("pc-screenglow"),
        mFlat = $("pc-mouth-flat"), mSmile = $("pc-mouth-smile"), mO = $("pc-mouth-o"),
        lids = svg.querySelectorAll("#pc-lids rect");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // transform origins in SVG user units
    [[head, "300px 280px"], [body, "300px 560px"], [headset, "300px 140px"], [neckset, "300px 330px"],
     [armL, "180px 560px"], [armR, "478px 560px"], [hand, "478px 330px"], [bubble, "404px 124px"]]
      .forEach(function (p) { p[0].style.transformBox = "view-box"; p[0].style.transformOrigin = p[1]; });
    lids[0].style.transformBox = lids[1].style.transformBox = "view-box";
    lids[0].style.transformOrigin = "274px 181px"; lids[1].style.transformOrigin = "326px 181px";

    var running = [], follow = false, alive = true, runId = 0;
    function anim(node, frames, ms, easing, delay) {
      var a = node.animate(frames, { duration: reduce ? 1 : ms, easing: easing || "cubic-bezier(.45,.05,.25,1)", fill: "forwards", delay: reduce ? 0 : (delay || 0) });
      running.push(a);
      return a.finished.catch(function () {});
    }
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };
    function set(node, css) { for (var k in css) node.style[k] = css[k]; }

    // state that both the script and the cursor-follow write to
    var look = { hx: 0, hy: 0, hr: 0, px: 0, py: 0 };
    function applyLook() {
      head.style.transform = "translate(" + look.hx + "px," + look.hy + "px) rotate(" + look.hr + "deg)";
      pupils.style.transform = "translate(" + look.px + "px," + look.py + "px)";
    }
    function lookTo(target, ms) {
      var from = Object.assign({}, look), t0 = performance.now(), dur = reduce ? 1 : ms, my = runId;
      return new Promise(function (res) {
        (function step(now) {
          if (!alive || my !== runId) return res();
          var k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          for (var key in target) look[key] = from[key] + (target[key] - from[key]) * e;
          applyLook();
          if (k < 1) requestAnimationFrame(step); else res();
        })(performance.now());
      });
    }
    function mouth(which) {
      [[mFlat, "flat"], [mSmile, "smile"], [mO, "o"]].forEach(function (m) { m[0].style.transition = "opacity .25s"; m[0].style.opacity = m[1] === which ? 1 : 0; });
    }
    function blink() {
      lids.forEach(function (l) { l.animate([{ transform: "scale(1,0)" }, { transform: "scale(1,1)" }, { transform: "scale(1,0)" }], { duration: 180 }); });
    }
    var blinker = setInterval(function () { if (alive && !reduce) blink(); }, 3800);

    // typing loop
    var typing = true;
    function typeLoop() {
      if (!typing || !alive) return;
      tl.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }], { duration: 220 });
      setTimeout(function () { tr.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }], { duration: 220 }); }, 130);
      glow.style.opacity = (0.7 + Math.random() * 0.3).toFixed(2);
      setTimeout(typeLoop, 300 + Math.random() * 120);
    }

    async function play() {
      var my = ++runId, ok = function () { return my === runId && alive; };
      // reset
      running.forEach(function (a) { a.cancel(); }); running = [];
      if (svg.getAnimations) svg.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
      follow = false; typing = true;
      Object.assign(look, { hx: 0, hy: 6, hr: 0, px: 0, py: 4 }); applyLook();
      set(neckset, { opacity: 0 }); set(armL, { opacity: 0 }); set(armR, { opacity: 0 }); set(bubble, { opacity: 0 });
      headset.style.opacity = 1; hands.style.opacity = 1; alertMark.style.opacity = 0; glow.style.opacity = .9; mouth("flat");
      brows.style.transform = "";
      if (reduce) { return finalPose(); }

      // 1. working on the laptop, eyes down on the screen
      typeLoop();
      anim(body, [{ transform: "translateY(0)" }, { transform: "translateY(2px)" }, { transform: "translateY(0)" }], 1400, "ease-in-out");
      await wait(2600); if (!ok()) return;

      // 2. notices something: stops typing, brows up, "!"
      typing = false;
      brows.animate([{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], { duration: 260, fill: "forwards" });
      alertMark.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, fill: "forwards" });
      await lookTo({ hy: 0, py: 0 }, 350); if (!ok()) return;
      await wait(450); if (!ok()) return;
      alertMark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });

      // 3. looks left...
      await lookTo({ hx: -12, hr: -7, px: -6, py: 0 }, 520); if (!ok()) return;
      await wait(650); if (!ok()) return;
      // 4. ...looks right
      await lookTo({ hx: 12, hr: 7, px: 6, py: 0 }, 700); if (!ok()) return;
      await wait(650); if (!ok()) return;
      // 5. spots the visitor in the centre
      await lookTo({ hx: 0, hr: 0, px: 0, py: 1 }, 420); if (!ok()) return;
      mouth("o"); blink();
      brows.animate([{ transform: "translateY(-6px)" }, { transform: "translateY(-9px)" }, { transform: "translateY(-3px)" }], { duration: 500, fill: "forwards" });
      await wait(600); if (!ok()) return;

      // 6. takes the headset off and rests it on the neck
      hands.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
      set(armL, { opacity: 1 });
      await anim(armL, [{ transform: "translate(0,240px)" }, { transform: "translate(0,0)" }], 520); if (!ok()) return;
      anim(armL, [{ transform: "translate(0,0)" }, { transform: "translate(-14px,-96px)" }], 380);
      await anim(headset, [{ transform: "translateY(0)" }, { transform: "translateY(-38px) rotate(-4deg)" }], 400); if (!ok()) return;
      await anim(headset, [{ transform: "translateY(-38px) rotate(-4deg)" }, { transform: "translateY(40px) scale(.95)", opacity: 0 }], 380, "ease-in"); if (!ok()) return;
      set(neckset, { opacity: 1 });
      anim(neckset, [{ transform: "translateY(-30px)", opacity: .3 }, { transform: "translateY(0)", opacity: 1 }], 380, "cubic-bezier(.3,1.4,.5,1)");
      await anim(armL, [{ transform: "translate(-14px,-96px)" }, { transform: "translate(0,260px)" }], 520, "ease-in"); if (!ok()) return;
      set(armL, { opacity: 0 });
      mouth("smile");

      // 7. waves hello
      set(armR, { opacity: 1 });
      await anim(armR, [{ transform: "translate(0,260px)" }, { transform: "translate(0,0)" }], 520, "cubic-bezier(.2,1.2,.4,1)"); if (!ok()) return;
      bubble.animate([{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], { duration: 380, easing: "cubic-bezier(.2,1.4,.5,1)", fill: "forwards" });
      await anim(hand, [{ transform: "rotate(0)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(0)" }], 1500, "ease-in-out"); if (!ok()) return;
      await wait(500); if (!ok()) return;
      await anim(armR, [{ transform: "translate(0,0)" }, { transform: "translate(0,260px)" }], 520, "ease-in"); if (!ok()) return;
      set(armR, { opacity: 0 });
      hands.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: "forwards" });
      setTimeout(function () { if (ok()) bubble.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }); }, 1600);

      // 8. from now on: follow the cursor
      if (ok()) follow = true;
    }

    function finalPose() {
      headset.style.opacity = 0; set(neckset, { opacity: 1 }); mouth("smile");
      set(bubble, { opacity: 1 }); follow = true;
    }

    // cursor / finger follow
    var target = { x: 0, y: 0 }, hasPointer = false;
    function onMove(x, y) {
      var r = svg.getBoundingClientRect();
      var cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.36;
      target.x = Math.max(-1, Math.min(1, (x - cx) / (innerWidth * 0.45)));
      target.y = Math.max(-1, Math.min(1, (y - cy) / (innerHeight * 0.5)));
      hasPointer = true;
    }
    function pm(e) { onMove(e.clientX, e.clientY); }
    function tm(e) { if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }
    addEventListener("pointermove", pm, { passive: true });
    addEventListener("touchmove", tm, { passive: true });
    (function loop() {
      if (!alive) return;
      if (follow && hasPointer) {
        var k = 0.12;
        look.hx += (target.x * 12 - look.hx) * k;
        look.hy += (target.y * 7 - look.hy) * k;
        look.hr += (target.x * 7 - look.hr) * k;
        look.px += (target.x * 6 - look.px) * k;
        look.py += (target.y * 3.5 - look.py) * k;
        applyLook();
      }
      requestAnimationFrame(loop);
    })();

    // start when visible, replay on click
    var started = false;
    function start() { if (!started) { started = true; play(); } }
    if ("IntersectionObserver" in window && opts.autoplay !== true) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(svg);
    } else { start(); }

    return {
      pose: function (name) {
        runId++; typing = false; follow = false; started = true;
        if (svg.getAnimations) svg.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        var L = { work: { hx: 0, hy: 6, hr: 0, px: 0, py: 4 }, left: { hx: -12, hy: 0, hr: -7, px: -6, py: 0 }, right: { hx: 12, hy: 0, hr: 7, px: 6, py: 0 } };
        Object.assign(look, L[name] || { hx: 0, hy: 0, hr: 0, px: 0, py: 1 }); applyLook();
        set(headset, { opacity: 1, transform: "" }); set(neckset, { opacity: 0, transform: "" }); set(armL, { opacity: 0, transform: "" });
        set(armR, { opacity: 0, transform: "" }); set(hand, { transform: "" }); set(bubble, { opacity: 0, transform: "" });
        set(hands, { opacity: 1 }); set(alertMark, { opacity: 0 }); set(brows, { transform: "" }); mouth("flat");
        if (name === "notice") { set(alertMark, { opacity: 1 }); set(brows, { transform: "translateY(-8px)" }); mouth("o"); }
        if (name === "lift") { set(hands, { opacity: 0 }); set(armL, { opacity: 1, transform: "translate(-14px,-96px)" }); set(headset, { transform: "translateY(-38px) rotate(-4deg)" }); mouth("o"); }
        if (name === "wave" || name === "final") { set(headset, { opacity: 0 }); set(neckset, { opacity: 1 }); mouth("smile"); }
        if (name === "wave") { set(hands, { opacity: 0 }); set(armR, { opacity: 1 }); set(hand, { transform: "rotate(-14deg)" }); set(bubble, { opacity: 1 }); }
        if (name === "final") follow = true;
      },
      replay: function () { started = true; play(); },
      destroy: function () { alive = false; clearInterval(blinker); removeEventListener("pointermove", pm); removeEventListener("touchmove", tm); el.innerHTML = ""; }
    };
  }

  global.PriyanshCharacter = { mount: mount };
})(window);
