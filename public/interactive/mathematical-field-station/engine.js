/* The Sightings — Mathematical Field Station (redesign)
 * Aim the instrument up to the tower top → release to LOCK the angle
 * (with a confirmation animation) → SCROLL to survey deeper, revealing the
 * mathematics as sticky chapters drawn in light on the held photograph.
 * Vanilla JS + SVG; all geometry lives in the plate's 1672x941 space.
 */
(function () {
  'use strict';
  var model = window.MathematicalFieldStationModel;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scene calibration (measured from the plate) --------------------------
  var TERRACE_Y = 670;
  var PIVOT = { x: 890, y: 670 };            // the instrument stays here; only the angle changes
  var TOWER_TOP = { x: 1260, y: 94 };
  var TOWER_BASE = { x: 1260, y: TERRACE_Y };
  var PX_PER_M_H = (TOWER_TOP.x - PIVOT.x) / 48;   // 7.708 px / horizontal metre
  var PX_PER_M_V = (TERRACE_Y - TOWER_TOP.y) / 30; // 19.2 px / vertical metre
  // The desktop target sits beyond the notebook rather than beneath it. On a
  // narrow crop the target shifts into the visible left edge of the scene.
  var FAR = { x: 520, y: 540 };
  var TRI_STATION_A_X = 620, TRI_STATION_B_X = 800;
  var FARP = { u: 64.162, z: 240 };          // far promontory true plan position (m)
  var GNOMON = { x: 688, y: TERRACE_Y };
  // The shadow chapter's model: coherent, easy-to-read numbers so the ratio
  // reads cleanly (1.5/2.5 = 30/50 = 0.6 -> theta ~31 deg, scale factor x20).
  // This is drawn from a SINGLE fixed slope (not the sun's dragged pixel
  // position) so the pin ray, tower ray and sun guide always share one exact
  // screen-space direction, whatever the sun happens to be doing visually.
  var PIN_M = 1.5, PIN_SHADOW_M = 2.5, TOWER_SHADOW_M = 50;
  var SHADOW_RATIO = PIN_M / PIN_SHADOW_M;                       // 0.6
  var SHADOW_THETA_DEG = deg(Math.atan(SHADOW_RATIO));           // ~30.96 deg
  var SHADOW_SLOPE = (PIN_M * PX_PER_M_V) / (PIN_SHADOW_M * PX_PER_M_H); // px rise / px run, shared by both rays
  var SECOND_DISTANCE_M = 80;
  var SECOND_PIVOT = TOWER_TOP.x - SECOND_DISTANCE_M * PX_PER_M_H;
  var LOCK_TOL = 20;                          // px tolerance for "on the top"

  // ---- DOM ------------------------------------------------------------------
  var $ = function (id) { return document.getElementById(id); };
  var station = $('station'), stage = $('stage'), svg = $('svg');
  var tripod = $('tripod'), barrel = $('barrel'), barrelArm = $('barrelArm'), instrHit = $('instrHit');
  var live = $('live'), committed = $('committed'), marksG = $('marks'), lockfx = $('lockfx');
  var sunCore = $('sunCore'), sunShadows = $('sunShadows');
  var ledger = $('ledger'), notebook = $('notebook'), notebookSub = $('notebookSub');
  var invite = $('invite'), grabHint = $('grabHint'), lockCue = $('lockCue'), scrollCue = $('scrollCue');
  var caption = $('caption'), capEye = $('captionEyebrow'), capTitle = $('captionTitle'), capBody = $('captionBody');
  var liveRegion = $('live-region');

  // ---- State ----------------------------------------------------------------
  var aim = dirFromPhi(40);          // start below the top so there is something to find
  var armed = false;                 // sightline currently on the tower top
  var locked = false;
  var lockedReading = null;
  var storyP = 0;
  var lastP = 0;
  var sunY = 250;
  var portraitish = false;
  var recordedChapters = {};

  // ---- helpers --------------------------------------------------------------
  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function norm(v) { var m = Math.hypot(v.x, v.y) || 1; return { x: v.x / m, y: v.y / m }; }
  function deg(r) { return r * 180 / Math.PI; }
  function rad(d) { return d * Math.PI / 180; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function angleBetween(a, b) { return Math.abs(deg(Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y))); }
  function dirFromPhi(phiDeg) { return { x: Math.cos(rad(phiDeg)), y: -Math.sin(rad(phiDeg)) }; } // phi above horizontal
  function phiOf(d) { return deg(Math.atan2(-d.y, d.x)); }
  function toScene(evt) { var p = svg.createSVGPoint(); p.x = evt.clientX; p.y = evt.clientY; var q = p.matrixTransform(svg.getScreenCTM().inverse()); return { x: q.x, y: q.y }; }
  function clearNode(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function say(m) { liveRegion.textContent = m; }
  function fmtM(x) { return x.toFixed(x < 10 ? 1 : 0); }
  function renderTex(node, tex) { try { window.katex.render(tex, node, { throwOnError: false }); } catch (e) { node.textContent = tex; } }
  function appendMathParts(node, parts) {
    parts.forEach(function (part) {
      if (typeof part === 'string') node.appendChild(document.createTextNode(part));
      else {
        var span = document.createElement('span');
        if (part.className) span.className = part.className;
        renderTex(span, part.tex); node.appendChild(span);
      }
    });
  }

  // clamp the aim into the upright cone: never below the horizon, never past vertical
  function setAim(dir) {
    var phi = clamp(phiOf(dir), -4, 89);
    aim = dirFromPhi(phi);
  }
  function aimAtPoint(pt) { setAim({ x: pt.x - PIVOT.x, y: pt.y - PIVOT.y }); }

  // readout of a sightline from a given pivotX aimed at a given point/dir
  function readoutFrom(pivotX, dir) {
    if (dir.x <= 0.02) return null;
    var t = (TOWER_TOP.x - pivotX) / dir.x;
    if (t <= 0) return null;
    var yCross = TERRACE_Y + t * dir.y;
    var hM = (TERRACE_Y - yCross) / PX_PER_M_V;
    var dM = (TOWER_TOP.x - pivotX) / PX_PER_M_H;
    return { yCross: yCross, hM: hM, dM: dM, theta: deg(Math.atan2(hM, dM)), pivotX: pivotX };
  }
  function aimToTopFrom(pivotX) { return norm({ x: TOWER_TOP.x - pivotX, y: TOWER_TOP.y - TERRACE_Y }); }

  // ============================================================================
  //  INSTRUMENT + MARK
  // ============================================================================
  function placeInstrument(dir) {
    tripod.setAttribute('x', (PIVOT.x - 82.5).toFixed(1));
    barrel.setAttribute('x', (PIVOT.x - 12).toFixed(1));
    barrelArm.setAttribute('transform', 'rotate(' + deg(Math.atan2(dir.y, dir.x)).toFixed(2) + ' ' + PIVOT.x + ' ' + PIVOT.y + ')');
    instrHit.setAttribute('aria-valuenow', Math.round(phiOf(dir)));
  }

  var markRing, markCore;
  function buildMark() {
    markRing = el('circle', { class: 'mark-ring', cx: TOWER_TOP.x, cy: TOWER_TOP.y, r: 26 });
    markCore = el('circle', { class: 'mark-core', cx: TOWER_TOP.x, cy: TOWER_TOP.y, r: 7 });
    markRing.style.transition = 'opacity .2s ease, r .3s ease';
    markCore.style.transition = 'opacity .2s ease';
    marksG.appendChild(markRing); marksG.appendChild(markCore);
  }
  function glowMark(on) {
    markRing.style.opacity = on ? '0.9' : '0';
    markCore.style.opacity = on ? '0.95' : '0';
    markRing.setAttribute('r', on ? 22 : 26);
  }

  // ============================================================================
  //  GEOMETRY-AS-LIGHT (reused across live aim + story chapters)
  // ============================================================================
  function arcPath(c, r, a0, a1) {
    var p0 = { x: c.x + r * Math.cos(a0), y: c.y + r * Math.sin(a0) };
    var p1 = { x: c.x + r * Math.cos(a1), y: c.y + r * Math.sin(a1) };
    return 'M' + p0.x + ' ' + p0.y + ' A' + r + ' ' + r + ' 0 0 ' + (a1 > a0 ? 1 : 0) + ' ' + p1.x + ' ' + p1.y;
  }
  function text(root, x, y, str, cls, anchor) {
    var t = el('text', { class: 'glyph ' + (cls || ''), x: x, y: y, 'text-anchor': anchor || 'start' });
    t.textContent = str; if (root) root.appendChild(t); return t;
  }

  // draw a tower right-triangle for a readout `r` taken from pivotX
  function drawTriangle(root, pivotX, r, opts) {
    opts = opts || {};
    var g = el('g', {}); if (opts.tint === 'teal') g.setAttribute('class', 'v2');
    var base = { x: pivotX, y: TERRACE_Y }, foot = TOWER_BASE, cross = { x: TOWER_TOP.x, y: r.yCross };
    var eye = { x: pivotX, y: TERRACE_Y - 8 };
    g.appendChild(el('path', { class: 'tri-fill', d: 'M' + base.x + ' ' + base.y + ' L' + foot.x + ' ' + foot.y + ' L' + cross.x + ' ' + cross.y + ' Z' }));
    g.appendChild(el('line', { class: 'baseline', x1: base.x, y1: base.y, x2: foot.x, y2: foot.y }));
    g.appendChild(el('line', { class: 'riser', x1: foot.x, y1: foot.y, x2: cross.x, y2: cross.y }));
    g.appendChild(el('line', { class: 'hyp', x1: eye.x, y1: eye.y, x2: cross.x, y2: cross.y }));
    if (!opts.hideGround) g.appendChild(el('path', { class: 'arc', d: arcPath(base, 78, 0, Math.atan2(cross.y - base.y, cross.x - base.x)) }));
    if (opts.labels && !opts.hideGround) {
      text(g, (base.x + foot.x) / 2, TERRACE_Y + 30, fmtM(r.dM) + ' m', 'gold mid', 'middle');
      g.appendChild(el('line', { class: 'tick', x1: cross.x - 8, y1: cross.y, x2: cross.x - 22, y2: cross.y }));
      g.appendChild(el('line', { class: 'tick', x1: foot.x - 8, y1: foot.y, x2: foot.x - 22, y2: foot.y }));
      g.appendChild(el('line', { class: 'tick', x1: cross.x - 15, y1: cross.y, x2: foot.x - 15, y2: foot.y }));
      text(g, base.x + 94, base.y - 14, r.theta.toFixed(0) + '°', 'gold small', 'start');
    }
    if (opts.labels && opts.labelHeight !== false) text(g, cross.x - 30, (cross.y + foot.y) / 2, fmtM(r.hM) + ' m', 'gold big', 'end');
    if (opts.opacity !== undefined) g.style.opacity = opts.opacity;
    root.appendChild(g);
    return g;
  }

  // ============================================================================
  //  PHASE 0 — AIMING (pre-lock)
  // ============================================================================
  function drawAim() {
    clearNode(live);
    var eye = { x: PIVOT.x, y: PIVOT.y - 8 };
    var r = readoutFrom(PIVOT.x, aim);
    var onBand = r && r.hM > 0.4 && r.yCross > TOWER_TOP.y - 30 && r.yCross < TERRACE_Y - 6;
    if (onBand) {
      drawTriangle(live, PIVOT.x, r, { labels: true });
    } else {
      var far = { x: eye.x + aim.x * 2600, y: eye.y + aim.y * 2600 };
      live.appendChild(el('line', { class: 'sightline dim', x1: eye.x, y1: eye.y, x2: far.x, y2: far.y }));
    }
    placeInstrument(aim);
  }

  function evaluateArm() {
    var r = readoutFrom(PIVOT.x, aim);
    armed = !!(r && Math.abs(r.yCross - TOWER_TOP.y) < LOCK_TOL);
    glowMark(armed);
    lockCue.classList.toggle('show', armed && !locked);
  }

  // ============================================================================
  //  THE LOCK  (satisfying confirmation that THIS is the right angle)
  // ============================================================================
  function lockIn() {
    if (locked) return;
    setAim(aimToTopFrom(PIVOT.x));              // snap exactly onto the top
    lockedReading = readoutFrom(PIVOT.x, aim);
    locked = true; armed = false;
    glowMark(false);
    lockCue.classList.remove('show'); grabHint.style.display = 'none';
    stage.classList.add('exploring');
    instrHit.setAttribute('aria-disabled', 'true');

    // confirmation animation: concentric rings + a flash on the geometry
    drawAim();
    if (!reduce) {
      live.style.animation = 'lockFlash .7s ease-out';
      setTimeout(function () { live.style.animation = ''; }, 720);
      [0, 140, 280].forEach(function (delay) {
        var ring = el('circle', { class: 'lock-ring', cx: TOWER_TOP.x, cy: TOWER_TOP.y, r: 6 });
        ring.style.animation = 'lockPulse .85s ease-out ' + delay + 'ms both';
        lockfx.appendChild(ring);
      });
      setTimeout(function () { clearNode(lockfx); }, 1300);
    }
    // reveal scroll affordance + open the story at p=0
    station.classList.add('unlocked');
    notebook.setAttribute('aria-hidden', 'false'); notebook.classList.add('show');
    scrollCue.classList.add('show');
    say('Angle locked. The tower is ' + fmtM(lockedReading.hM) + ' metres tall. Scroll to survey deeper.');
    renderStory(0);
  }

  // ============================================================================
  //  PHASE 1 — THE SCROLL STORY (sticky, layered reveal)
  // ============================================================================
  var CHAPTERS = [
    { id: 'hold', a: 0.00, b: 0.06 },
    { id: 'measure', a: 0.06, b: 0.24 },
    { id: 'prove', a: 0.24, b: 0.42 },
    { id: 'twice', a: 0.42, b: 0.60 },
    { id: 'shadow', a: 0.60, b: 0.80 },
    { id: 'triangulate', a: 0.80, b: 1.00 }
  ];
  function chapterAt(p) {
    for (var i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].a && p < CHAPTERS[i].b) return CHAPTERS[i];
    return CHAPTERS[CHAPTERS.length - 1];
  }
  function localP(ch, p) { return smooth((p - ch.a) / (ch.b - ch.a)); }

  function renderStory(p) {
    storyP = p;
    // Recomputed every render, not only on a 'resize' event: a viewport
    // change and a chapter render can race (e.g. a test or a fast resize
    // during an active scroll), and a stale viewBox is exactly how the
    // triangulate chapter's labels ended up drawn against the wrong crop.
    applyViewport();
    var ch = chapterAt(p);
    var lp = localP(ch, p);
    var r = lockedReading;
    clearNode(live); clearNode(committed); clearNode(sunShadows);
    live.style.opacity = '1';

    // the locked triangle is the constant spine of every chapter — its own
    // ground distance/angle labels are dropped whenever another chapter's
    // geometry needs that same ground band: the sliding second-vantage
    // triangle passes right through it mid-transition, and the survey
    // stations/baseline own it during triangulation. Removing a redundant
    // label beats shrinking either one.
    var busyGroundChapters = ch.id === 'triangulate' || ch.id === 'twice' || ch.id === 'shadow';
    drawTriangle(live, PIVOT.x, r, { labels: true, hideGround: busyGroundChapters });
    placeInstrument(aim);
    positionCaption();

    // sun: high until the shadow chapter, then descends and stays low
    var targetSunY = 250;
    if (ch.id === 'shadow') targetSunY = lerp(250, 330, lp);
    else if (p >= CHAPTERS[4].b) targetSunY = 330;
    sunY = targetSunY; applyAtmosphere();

    if (ch.id === 'prove') provePulse(r, lp);
    if (ch.id === 'twice') drawSecondVantage(lp);
    if (ch.id === 'shadow') drawShadowRule(lp);
    if (ch.id === 'triangulate') drawTriangulation(lp);

    // the opening scroll cue only ever belongs to the pre-story moment; once
    // the survey has moved on it must stay gone regardless of how a given
    // frame was reached (real scroll, dwell snap-back, or a debug jump).
    scrollCue.classList.toggle('show', p < 0.04);

    updateCaption(ch, lp, r);
    recordChapter(ch, r);
  }

  function provePulse(r, lp) {
    // briefly highlight the sides being related by the formula
    var g = el('g', {}); g.style.opacity = 0.5 + 0.5 * Math.sin(lp * Math.PI);
    g.appendChild(el('line', { class: 'hyp', x1: PIVOT.x, y1: TERRACE_Y - 8, x2: TOWER_TOP.x, y2: r.yCross }));
    live.appendChild(g);
  }

  function drawSecondVantage(lp) {
    var r2 = readoutFrom(SECOND_PIVOT, aimToTopFrom(SECOND_PIVOT));
    var px = lerp(PIVOT.x, SECOND_PIVOT, lp);
    var rp = readoutFrom(px, aimToTopFrom(px));
    // a teal triangle slides from the first vantage out to the second
    drawTriangle(committed, px, rp, { tint: 'teal', labels: true, labelHeight: false, opacity: 0.4 + 0.6 * lp });
    // keep the gold locked one dimmed behind
    live.style.opacity = String(1 - 0.4 * lp);
    void r2;
  }

  // 0/1 reveal envelope for a [a,b] sub-range of the chapter's local progress
  function stageP(lp, a, b) { return clamp((lp - a) / (b - a), 0, 1); }

  function drawShadowRule(lp) {
    var sunX = Number(sunCore.getAttribute('cx'));
    var sunSceneY = Number(sunCore.getAttribute('cy'));
    var dir = sunX < GNOMON.x ? 1 : -1;
    var gTopY = GNOMON.y - PIN_M * PX_PER_M_V, tTopY = TERRACE_Y - 30 * PX_PER_M_V;
    // Coherent, easy-to-read fixed lengths (1.5/2.5 = 30/50 = 0.6) rather than
    // whatever the dragged sun position happens to produce. The sun still
    // drives the visible light and atmosphere, but the pin ray, tower ray and
    // sun guide are all built from this one shared slope, so they can never
    // disagree with each other or with the tower's already-established 30 m.
    var Lg = PIN_SHADOW_M * PX_PER_M_H, Lt = TOWER_SHADOW_M * PX_PER_M_H;
    var tipPin = { x: GNOMON.x + dir * Lg, y: GNOMON.y };
    var tipTower = { x: TOWER_BASE.x + dir * Lt, y: TERRACE_Y };

    // Pedagogical sequence: pin -> one sun direction -> parallel shadows ->
    // equal angle markers -> corresponding sides -> the ratio/scale reveal.
    var pinOn = stageP(lp, 0.00, 0.16);
    var guideOn = stageP(lp, 0.10, 0.30);
    var raysOn = stageP(lp, 0.26, 0.52);
    var angleOn = stageP(lp, 0.50, 0.68);
    var sidesOn = stageP(lp, 0.62, 0.80);
    var scaleOn = stageP(lp, 0.84, 1.00);

    var gnomonPole = el('line', { class: 'gnomon', x1: GNOMON.x, y1: GNOMON.y, x2: GNOMON.x, y2: gTopY });
    gnomonPole.style.opacity = String(pinOn);
    var guide = el('line', { class: 'sun-guide', x1: sunX, y1: sunSceneY, x2: GNOMON.x, y2: gTopY });
    guide.style.opacity = String(0.5 * guideOn);
    var pinShadow = el('line', { class: 'sun-shadow gnomon', x1: GNOMON.x, y1: GNOMON.y, x2: tipPin.x, y2: tipPin.y });
    var towerShadow = el('line', { class: 'sun-shadow tower', x1: TOWER_BASE.x, y1: TERRACE_Y, x2: tipTower.x, y2: tipTower.y });
    pinShadow.style.opacity = String(raysOn); towerShadow.style.opacity = String(0.55 * raysOn);
    var pinRay = el('line', { class: 'sun-shadow constr', x1: tipPin.x, y1: tipPin.y, x2: GNOMON.x, y2: gTopY });
    var towerRay = el('line', { class: 'sun-shadow constr', x1: tipTower.x, y1: tipTower.y, x2: TOWER_BASE.x, y2: tTopY });
    pinRay.style.opacity = String(0.9 * raysOn); towerRay.style.opacity = String(0.9 * raysOn);
    sunShadows.appendChild(gnomonPole); sunShadows.appendChild(guide);
    sunShadows.appendChild(pinShadow); sunShadows.appendChild(towerShadow);
    sunShadows.appendChild(pinRay); sunShadows.appendChild(towerRay);

    // The same angle theta, marked identically on both triangles — the
    // whole point being that the small one and the huge one share it.
    if (angleOn > 0.01) {
      var a0 = Math.atan2(0, -dir), a1 = Math.atan2(gTopY - GNOMON.y, -dir * Lg);
      var pinArc = el('path', { class: 'arc', d: arcPath(tipPin, 20, a0, a1) });
      var towerArc = el('path', { class: 'arc', d: arcPath(tipTower, 34, a0, a1) });
      pinArc.style.opacity = towerArc.style.opacity = String(angleOn);
      sunShadows.appendChild(pinArc); sunShadows.appendChild(towerArc);
      var midPin = (a0 + a1) / 2, midTower = midPin;
      var thetaPin = text(sunShadows, tipPin.x + 30 * Math.cos(midPin), tipPin.y + 30 * Math.sin(midPin), 'θ', 'gold small', 'middle');
      var thetaTower = text(sunShadows, tipTower.x + 48 * Math.cos(midTower), tipTower.y + 48 * Math.sin(midTower), 'θ', 'gold mid', 'middle');
      thetaPin.style.opacity = thetaTower.style.opacity = String(angleOn);
    }

    if (sidesOn > 0.01) {
      var pinHeight = text(sunShadows, GNOMON.x - dir * 14, (GNOMON.y + gTopY) / 2, PIN_M.toFixed(1) + ' m', 'small', dir > 0 ? 'end' : 'start');
      var pinLen = text(sunShadows, GNOMON.x + dir * Lg / 2, GNOMON.y + 26, PIN_SHADOW_M.toFixed(1) + ' m', 'small', 'middle');
      var towerLen = text(sunShadows, TOWER_BASE.x + dir * Lt / 2, TERRACE_Y + 40, TOWER_SHADOW_M.toFixed(0) + ' m', 'mid violet', 'middle');
      pinHeight.style.opacity = pinLen.style.opacity = towerLen.style.opacity = String(sidesOn);
    }

    if (scaleOn > 0.01) {
      var badge = text(sunShadows, GNOMON.x, gTopY - 20, '× 20', 'mid violet', 'middle');
      badge.style.opacity = String(scaleOn);
    }
  }

  // On the wide composition the triangulation group normally sits at a fixed
  // scene position, but on a shorter/narrower "wide" viewport (e.g. a tablet
  // landscape) the field notebook can grow tall enough to reach it. Rather
  // than a second hard-coded position, read the notebook's actual rendered
  // box and nudge the whole group clear of it only when it would intrude —
  // the reads are cached and only redone when the viewport actually changes.
  // Station A and the far target sit near the notebook; station B already
  // anchors close to the instrument by design and is left alone. A and the
  // target are independent points (nothing requires them to keep a fixed
  // offset from each other), so each is simply held clear of the notebook's
  // actual right edge on its own — whichever needs more room moves more.
  var wideLayoutCache = { key: null, minX: 0 };
  function wideLayoutMinX() {
    var key = window.innerWidth + 'x' + window.innerHeight;
    if (wideLayoutCache.key !== key) {
      var nb = notebook.getBoundingClientRect();
      var pt = svg.createSVGPoint(); pt.x = nb.right; pt.y = nb.bottom;
      var minX = pt.matrixTransform(svg.getScreenCTM().inverse()).x + 30;
      wideLayoutCache = { key: key, minX: minX };
    }
    return wideLayoutCache.minX;
  }

  function drawTriangulation(lp) {
    var narrowScene = portraitish;   // single source of truth — see applyViewport()
    var stationShift = narrowScene ? 420 : 0;
    var minX = narrowScene ? 0 : wideLayoutMinX() + 14; // + room for the "A" label's own width
    var eyeA = { x: narrowScene ? TRI_STATION_A_X + stationShift : Math.max(TRI_STATION_A_X, minX), y: TERRACE_Y - 8 };
    var eyeB = { x: TRI_STATION_B_X + stationShift, y: TERRACE_Y - 8 };
    var far = narrowScene ? { x: 930, y: 540 } : { x: Math.max(FAR.x, minX), y: FAR.y };
    var baseline = el('line', { class: 'survey-baseline', x1: eyeA.x, y1: eyeA.y, x2: eyeB.x, y2: eyeB.y });
    baseline.style.opacity = String(0.3 + 0.7 * lp); committed.appendChild(baseline);
    [eyeA, eyeB].forEach(function (stationPoint, index) {
      var marker = el('circle', { class: 'survey-station', cx: stationPoint.x, cy: stationPoint.y, r: 10 });
      marker.style.opacity = String(0.35 + 0.65 * lp); committed.appendChild(marker);
      text(committed, stationPoint.x, stationPoint.y - 18, index === 0 ? 'A' : 'B', 'violet small survey-station-label', 'middle');
    });
    // shorter than "measured baseline b" so it fits between A and B even
    // when they've been drawn in close together to clear the notebook
    text(committed, (eyeA.x + eyeB.x) / 2, eyeA.y + 34, 'baseline b', 'violet small survey-baseline-label', 'middle');
    var reachA = { x: lerp(eyeA.x, far.x, clamp(lp * 2, 0, 1)), y: lerp(eyeA.y, far.y, clamp(lp * 2, 0, 1)) };
    var reachB = { x: lerp(eyeB.x, far.x, clamp(lp * 2 - 0.6, 0, 1)), y: lerp(eyeB.y, far.y, clamp(lp * 2 - 0.6, 0, 1)) };
    committed.appendChild(el('line', { class: 'sun-shadow constr triangulation-bearing', x1: eyeA.x, y1: eyeA.y, x2: reachA.x, y2: reachA.y }));
    committed.appendChild(el('line', { class: 'sun-shadow constr triangulation-bearing', x1: eyeB.x, y1: eyeB.y, x2: reachB.x, y2: reachB.y }));
    if (lp > 0.8) {
      var star = el('circle', { class: 'triangulation-target', cx: far.x, cy: far.y, r: 9 });
      star.style.opacity = '.95'; star.setAttribute('fill', '#c9b7ff'); committed.appendChild(star);
      var labelX = narrowScene ? far.x + 190 : far.x + 18;
      var labelAnchor = narrowScene ? 'middle' : 'start';
      if (narrowScene) committed.appendChild(el('line', { class: 'triangulation-leader', x1: far.x + 14, y1: far.y, x2: labelX - 100, y2: far.y }));
      text(committed, labelX, far.y - 20, 'bearing intersection', 'violet small triangulation-target-label', labelAnchor);
      text(committed, labelX, far.y + 16, '≈ ' + fmtM(triangulationResult().dist) + ' m away', 'violet small triangulation-target-distance', labelAnchor);
    }
  }

  // triangulation numbers (also used in the caption + test)
  function triangulationResult() {
    var uA = (PIVOT.x - TRI_STATION_A_X) / PX_PER_M_H, uB = (PIVOT.x - TRI_STATION_B_X) / PX_PER_M_H;
    var b = Math.abs(uB - uA);
    var alpha = angleBetween({ x: uB - uA, y: 0 }, { x: FARP.u - uA, y: FARP.z });
    var beta = angleBetween({ x: uA - uB, y: 0 }, { x: FARP.u - uB, y: FARP.z });
    var gamma = 180 - alpha - beta;
    return { baseline: b, beta: beta, gamma: gamma, dist: b * Math.sin(rad(beta)) / Math.sin(rad(gamma)) };
  }

  // ---- captions -------------------------------------------------------------
  // Most chapters render their caption body once, the first time they're
  // entered. The shadow chapter additionally re-renders when it crosses from
  // its setup framing into the ratio reveal, keyed by `c.stage(lp)`.
  function updateCaption(ch, lp, r) {
    var c = CAPTIONS[ch.id]; if (!c) { caption.classList.remove('show'); return; }
    var stage = c.stage ? c.stage(lp) : '';
    var key = ch.id + ':' + stage;
    if (caption.dataset.key !== key) {
      caption.dataset.key = key;
      capEye.className = 'eyebrow ' + (c.tint || '');
      capEye.textContent = c.eyebrow;
      capTitle.textContent = c.title;
      capBody.innerHTML = ''; c.body(capBody, r, stage);
    }
    caption.classList.add('show');
  }
  var CAPTIONS = {
    measure: { eyebrow: 'Measure it', title: 'One triangle, three facts',
      body: function (n, r) { n.textContent = 'The terrace is the base (' + fmtM(r.dM) + ' m), the tower the height (' + fmtM(r.hM) + ' m), your sightline the hypotenuse — meeting the ground at ' + r.theta.toFixed(0) + '°.'; } },
    prove: { eyebrow: 'Prove it', title: 'How the height is calculated',
      body: function (n, r) { var s = document.createElement('div'); n.appendChild(s); renderTex(s, 'h = d\\,\\tan\\theta = ' + fmtM(r.dM) + '\\times\\tan(' + r.theta.toFixed(0) + '^\\circ) \\approx ' + fmtM(r.hM) + '\\text{ m}'); } },
    twice: { eyebrow: 'Prove it twice', tint: 'teal', title: 'A different sightline, the same truth',
      body: function (n) { n.textContent = 'Step back to 80 m and the angle falls to 21° — yet the tower is still 30 m. A real measurement, not an artefact of where you stood.'; } },
    shadow: { eyebrow: 'The shadow rule', tint: 'violet',
      title: 'The angle stays the same, so the ratio stays the same',
      stage: function (lp) { return lp < 0.62 ? 'setup' : 'ratio'; },
      body: function (n, r, stage) {
        if (stage === 'setup') {
          n.textContent = 'The pin and the tower are both vertical, both lit by the same low sun. Their shadows fall the same way — at the same angle θ — so the height-to-shadow ratio has to match too.';
          return;
        }
        n.appendChild(document.createTextNode('The small triangle and the huge one are scaled copies:'));
        var eq = document.createElement('div'); eq.style.marginTop = '.35em'; n.appendChild(eq);
        renderTex(eq, '\\tan\\theta=\\dfrac{1.5}{2.5}=\\dfrac{30}{50}=0.6\\ \\Rightarrow\\ \\theta\\approx31^\\circ');
        var scale = document.createElement('div'); scale.style.marginTop = '.5em'; n.appendChild(scale);
        renderTex(scale, 'H=50\\left(\\dfrac{1.5}{2.5}\\right)=30\\ \\mathrm{m}\\quad(\\times20\\text{ scale}\\!)');
      } },
    triangulate: { eyebrow: 'Triangulate', tint: 'violet', title: 'Fixing what you cannot reach',
      body: function (n) { var t = triangulationResult(); var s = document.createElement('div'); n.appendChild(s); renderTex(s, '\\frac{d}{\\sin\\beta}=\\frac{b}{\\sin\\gamma}\\Rightarrow d\\approx' + fmtM(t.dist) + '\\text{ m}'); } }
  };

  // ---- notebook -------------------------------------------------------------
  function recordChapter(ch, r) {
    if (ch.id === 'hold' || recordedChapters[ch.id]) return;
    recordedChapters[ch.id] = true;
    var entries = {
      measure: { tone: 'gold', label: 'The tower', parts: [
        'From ', { tex: fmtM(r.dM) + '\\,\\mathrm{m}' }, ' away at ',
        { tex: r.theta.toFixed(0) + '^\\circ' }, ': height ', { tex: fmtM(r.hM) + '\\,\\mathrm{m}' }, '.'
      ] },
      prove: { tone: 'gold', labelTex: 'h=d\\tan\\theta', parts: [
        'The rounded reading agrees with the ', { tex: '30\\,\\mathrm{m}' }, ' model through right-angled trigonometry.'
      ] },
      twice: { tone: 'teal', label: 'Confirmed', parts: [
        'A second sightline at ', { tex: '80\\,\\mathrm{m}' }, ' and ', { tex: '21^\\circ' },
        ' recovers the same ', { tex: '30\\,\\mathrm{m}' }, '.'
      ] },
      shadow: { tone: 'violet', label: 'Shadow rule', parts: [
        { tex: '\\tan\\theta=\\tfrac{1.5}{2.5}=\\tfrac{30}{50}=0.6' }, ': the pin scales ',
        { tex: '\\times20' }, ' up to the tower’s ', { tex: '30\\,\\mathrm{m}' }, '.'
      ] },
      triangulate: { tone: 'violet', label: 'Triangulation', parts: [
        'Two bearings fix the far promontory at ',
        { tex: '\\approx ' + fmtM(triangulationResult().dist) + '\\,\\mathrm{m}' }, '.'
      ] }
    };
    var entry = entries[ch.id]; if (!entry) return;
    var li = document.createElement('li');
    var tag = document.createElement('span'); tag.className = 'tag ' + entry.tone;
    if (entry.labelTex) renderTex(tag, entry.labelTex); else tag.textContent = entry.label;
    var line = document.createElement('p'); line.className = 'line';
    appendMathParts(line, entry.parts);
    li.appendChild(tag); li.appendChild(line);
    ledger.appendChild(li);
    notebookSub.textContent = ledger.children.length + ' of 5 recorded.';
  }

  // ============================================================================
  //  ATMOSPHERE (sun height)
  // ============================================================================
  function applyAtmosphere() {
    var elev = 70 - smooth((sunY - 80) / (380 - 80)) * 54;
    var low = clamp((70 - elev) / 54, 0, 1);
    stage.style.setProperty('--sun-x', (470 / 1672 * 100) + '%');
    stage.style.setProperty('--sun-y', (sunY / 941 * 100) + '%');
    stage.style.setProperty('--atmos-strength', (0.35 + low * 0.5).toFixed(2));
    stage.style.setProperty('--dusk-strength', (low * 0.6).toFixed(2));
    stage.style.setProperty('--vignette', (0.4 + low * 0.45).toFixed(2));
    $('plate').style.filter = 'saturate(' + (1 + low * 0.28).toFixed(2) + ') brightness(' + (1 - low * 0.14).toFixed(2) +
      ') sepia(' + (low * 0.28).toFixed(2) + ') hue-rotate(' + (-low * 6).toFixed(1) + 'deg) contrast(' + (1 + low * 0.06).toFixed(2) + ')';
    sunCore.setAttribute('cx', 470); sunCore.setAttribute('cy', sunY);
  }

  // ============================================================================
  //  INPUT
  // ============================================================================
  var dragging = false, liveQueued = false;
  function scheduleAim() { if (liveQueued) return; liveQueued = true; requestAnimationFrame(function () { liveQueued = false; evaluateArm(); drawAim(); }); }

  instrHit.addEventListener('pointerdown', function (evt) {
    if (locked) return;
    evt.preventDefault(); dragging = true; stage.classList.add('grabbed');
    grabHint.style.display = 'none';
    try { evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    onMove(evt);
  });
  function onMove(evt) { if (!dragging || locked) return; aimAtPoint(toScene(evt)); scheduleAim(); }
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', function () {
    if (!dragging) return; dragging = false; stage.classList.remove('grabbed');
    evaluateArm(); if (armed) lockIn();
  });
  window.addEventListener('pointercancel', function () { dragging = false; stage.classList.remove('grabbed'); });

  // ---- Chapter dwell state machine ------------------------------------------
  // Every completed chapter (except the opening 'hold') gets one guaranteed
  // beat at its resolved frame: open -> dwelling -> released. onScroll()
  // detects the boundary crossing (however large the jump that caused it —
  // see the reconciliation loop above) and snaps the scroll position to that
  // exact resolved frame *before* the dwell is shown, so it is never skipped.
  // `done` tracks which chapters have already had their dwell this forward
  // pass; scrolling back before a chapter clears its own entry (see above),
  // which is the only way to re-arm it.
  var dwell = { state: 'open', chapterId: null, atP: 0, done: {} };
  var dwellTimer = null, touchStartY = null;
  var DWELL_EPS = 1e-3;   // big enough to survive scrollTop rounding, small enough to stay visually resolved

  function startDwell(ch, boundaryP) {
    dwell.state = 'dwelling'; dwell.chapterId = ch.id; dwell.atP = boundaryP;
    setScrollP(boundaryP);
    lastP = boundaryP;
    renderStory(boundaryP);
    caption.classList.add('captured');
    say((CAPTIONS[ch.id] ? CAPTIONS[ch.id].title : ch.id) + ' — result captured.');
    clearTimeout(dwellTimer);
    dwellTimer = setTimeout(function () { releaseDwell(boundaryP); }, reduce ? 300 : 900);
  }
  function releaseDwell(atP) {
    if (dwell.state !== 'dwelling') return;
    clearTimeout(dwellTimer);
    dwell.done[dwell.chapterId] = true;
    dwell.state = 'open'; dwell.chapterId = null;
    caption.classList.remove('captured');
    lastP = atP; renderStory(atP);
  }
  // wheel / touch / keyboard only ever need to ABSORB forward input while
  // actively dwelling — onScroll()'s reconciliation is what starts a dwell,
  // so these never have to predict a boundary crossing themselves.
  station.addEventListener('wheel', function (evt) {
    if (dwell.state === 'dwelling' && evt.deltaY > 0) evt.preventDefault();
  }, { passive: false });
  station.addEventListener('touchstart', function (evt) {
    if (evt.touches.length === 1) touchStartY = evt.touches[0].clientY;
  }, { passive: true });
  station.addEventListener('touchmove', function (evt) {
    if (touchStartY !== null && evt.touches.length === 1) {
      var forward = touchStartY - evt.touches[0].clientY > 0;
      if (dwell.state === 'dwelling' && forward) evt.preventDefault();
    }
  }, { passive: false });
  station.addEventListener('touchend', function () { touchStartY = null; }, { passive: true });
  window.addEventListener('keydown', function (evt) {
    if ((evt.key === 'PageDown' || evt.key === 'ArrowDown' || evt.key === ' ') && dwell.state === 'dwelling') evt.preventDefault();
  }, { capture: true });

  instrHit.addEventListener('keydown', function (evt) {
    if (locked) return;
    var phi = phiOf(aim);
    if (evt.key === 'ArrowUp') phi += 2;
    else if (evt.key === 'ArrowDown') phi -= 2;
    else if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault(); setAim(aimToTopFrom(PIVOT.x)); evaluateArm();
      if (!armed) { setAim(aimToTopFrom(PIVOT.x)); }   // snap exactly to the top
      lockIn(); return;
    } else return;
    evt.preventDefault(); setAim(dirFromPhi(phi)); evaluateArm(); drawAim();
  });

  // scroll drives the story once unlocked
  function scrollTotal() { return station.offsetHeight - window.innerHeight; }
  function currentP() {
    var total = scrollTotal();
    var scrolled = clamp(-station.getBoundingClientRect().top, 0, total);
    return total > 0 ? scrolled / total : 0;
  }
  function setScrollP(p) {
    var total = scrollTotal();
    window.scrollTo(0, Math.round(total * clamp(p, 0, 1)));
  }
  function onScroll() {
    if (!locked) return;
    var p = currentP();

    if (dwell.state === 'dwelling') {
      if (p < dwell.atP - DWELL_EPS) { releaseDwell(p); return; }  // reverse intent — let go at once
      if (Math.abs(p - dwell.atP) > DWELL_EPS) setScrollP(dwell.atP); // absorb residual forward momentum
      return;
    }

    // Forward-jump reconciliation: whatever the input device just did
    // (a single wheel tick, a flung trackpad gesture, a keyboard PageDown),
    // if it stepped over an un-dwelled chapter boundary, pull the position
    // back to that boundary and dwell there — no matter how large the jump.
    if (p > lastP) {
      for (var i = 0; i < CHAPTERS.length; i++) {
        var c = CHAPTERS[i], boundary = Math.min(c.b, 1);
        if (c.id !== 'hold' && lastP < boundary && p >= boundary && !dwell.done[c.id]) {
          // chapterAt() uses a half-open [a,b) range, so rendering at the
          // boundary itself would already classify as the NEXT chapter —
          // render a hair inside this one instead, still fully resolved.
          startDwell(c, boundary - DWELL_EPS);
          return;
        }
      }
    } else {
      // scrolling back before a chapter re-arms its dwell for next time
      CHAPTERS.forEach(function (ch) { if (ch.a > p + 1e-3) delete dwell.done[ch.id]; });
    }

    lastP = p;
    renderStory(p);
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });

  // ============================================================================
  //  BOOT
  // ============================================================================
  function applyViewport() {
    portraitish = window.innerWidth < 760 || (window.innerWidth / window.innerHeight) < 1.15;
    svg.setAttribute('viewBox', portraitish ? '748 0 600 941' : '0 0 1672 941');
  }
  function boot() {
    buildMark(); applyViewport(); applyAtmosphere(); evaluateArm(); drawAim();
    positionGrabHint(); positionCaption();
    window.addEventListener('resize', function () { applyViewport(); positionGrabHint(); positionCaption(); if (locked) onScroll(); else drawAim(); });
  }
  function positionGrabHint() {
    var m = svg.getScreenCTM(), rect = svg.getBoundingClientRect();
    var pt = svg.createSVGPoint(); pt.x = PIVOT.x + 110; pt.y = PIVOT.y - 150;
    var s = pt.matrixTransform(m);
    grabHint.style.left = (s.x - rect.left) + 'px'; grabHint.style.top = (s.y - rect.top) + 'px';
  }
  function positionCaption() {
    var stageRect = stage.getBoundingClientRect(), instrumentRect = tripod.getBoundingClientRect();
    var narrow = portraitish;   // single source of truth — see applyViewport()
    if (!narrow) {
      caption.style.removeProperty('left'); caption.style.removeProperty('right'); caption.style.removeProperty('width');
      return;
    }
    var gap = 18, edge = 16;
    var leftSpace = instrumentRect.left - stageRect.left - gap - edge;
    var rightSpace = stageRect.right - instrumentRect.right - gap - edge;
    var width = Math.max(190, Math.min(520, Math.max(leftSpace, rightSpace)));
    if (rightSpace >= leftSpace) {
      caption.style.left = (instrumentRect.right - stageRect.left + gap) + 'px';
      caption.style.right = 'auto';
    } else {
      caption.style.left = Math.max(edge, instrumentRect.left - stageRect.left - gap - width) + 'px';
      caption.style.right = 'auto';
    }
    caption.style.width = width + 'px';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  // ---- test / QA hooks ------------------------------------------------------
  window.__fieldStation = {
    aimPhi: function (phi) { setAim(dirFromPhi(phi)); evaluateArm(); drawAim(); return { armed: armed, readout: readoutFrom(PIVOT.x, aim) }; },
    lock: function () { setAim(aimToTopFrom(PIVOT.x)); evaluateArm(); lockIn(); return lockedReading; },
    get locked() { return locked; },
    // force-render a frame regardless of scroll position — for inspecting a
    // chapter's geometry/labels without exercising the dwell state machine.
    story: function (p) { p = clamp(p, 0, 1); if (locked) { lastP = p; renderStory(p); } return { chapter: chapterAt(p).id, ledger: ledger.children.length }; },
    // drive the REAL scroll position (through onScroll -> the reconciliation
    // + dwell logic) — use this to test the dwell state machine itself.
    scrollToP: function (p) { setScrollP(p); onScroll(); return { p: currentP(), dwell: dwell.state }; },
    dwellState: function () { return { state: dwell.state, chapterId: dwell.chapterId, atP: dwell.atP, done: Object.keys(dwell.done) }; },
    shadowModel: function () {
      return { pinRatio: PIN_M / PIN_SHADOW_M, towerRatio: 30 / TOWER_SHADOW_M, theta: SHADOW_THETA_DEG, slope: SHADOW_SLOPE, scaleFactor: TOWER_SHADOW_M / PIN_SHADOW_M, recoveredHeight: TOWER_SHADOW_M * (PIN_M / PIN_SHADOW_M) };
    },
    triangulation: triangulationResult,
    readoutFrom: readoutFrom, aimToTopFrom: aimToTopFrom
  };

  // ---- debug mode (?debug=1) -------------------------------------------------
  if (/(?:^|[?&])debug=1(?:&|$)/.test(location.search)) initDebugPanel();
  function initDebugPanel() {
    var panel = document.createElement('div');
    panel.id = 'fsDebug';
    panel.style.cssText = 'position:fixed;z-index:999;left:8px;bottom:8px;max-width:340px;' +
      'font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;color:#c8f7d0;background:rgba(4,10,14,.88);' +
      'border:1px solid rgba(143,227,207,.4);border-radius:8px;padding:8px 10px;white-space:pre;pointer-events:none';
    document.body.appendChild(panel);
    var overlay = document.createElementNS(SVGNS, 'g');
    overlay.setAttribute('id', 'fsDebugOverlay');
    svg.appendChild(overlay);

    function boxesOverlap(a, b, pad) {
      pad = pad || 0;
      return a.x < b.x + b.width + pad && a.x + a.width + pad > b.x &&
        a.y < b.y + b.height + pad && a.y + a.height + pad > b.y;
    }
    function labelRects() {
      var sels = ['#notebook', '#caption', '#tripod', '#barrel', '.triangulation-target-label',
        '.triangulation-target-distance', '.survey-station-label', '.survey-baseline-label', '#scrollCue'];
      var out = [];
      sels.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (elm) {
          var r = elm.getBoundingClientRect();
          if (r.width && r.height) out.push({ sel: sel, x: r.x, y: r.y, width: r.width, height: r.height });
        });
      });
      return out;
    }
    function tick() {
      var ch = chapterAt(storyP), lp = localP(ch, storyP);
      var rects = labelRects();
      var collisions = [];
      for (var i = 0; i < rects.length; i++) {
        for (var j = i + 1; j < rects.length; j++) {
          if (rects[i].sel === rects[j].sel) continue; // same kind (e.g. two stations) is expected to sit apart, not flagged as a pair type
          if (boxesOverlap(rects[i], rects[j], 4)) collisions.push(rects[i].sel + ' × ' + rects[j].sel);
        }
      }
      clearNode(overlay);
      rects.forEach(function (rc) {
        var pt1 = svg.createSVGPoint(); pt1.x = rc.x; pt1.y = rc.y;
        var m = svg.getScreenCTM().inverse();
        var s1 = pt1.matrixTransform(m);
        var pt2 = svg.createSVGPoint(); pt2.x = rc.x + rc.width; pt2.y = rc.y + rc.height;
        var s2 = pt2.matrixTransform(m);
        overlay.appendChild(el('rect', {
          x: s1.x, y: s1.y, width: s2.x - s1.x, height: s2.y - s1.y,
          fill: 'none', stroke: collisions.length ? '#ff6b6b' : 'rgba(143,227,207,.7)', 'stroke-width': 1
        }));
      });
      var sm = window.__fieldStation.shadowModel();
      panel.textContent = [
        'chapter: ' + ch.id + '  p=' + storyP.toFixed(3) + '  local=' + lp.toFixed(2),
        'dwell: ' + dwell.state + (dwell.chapterId ? ' (' + dwell.chapterId + ')' : ''),
        'composition: ' + (portraitish ? 'narrow/portrait' : 'wide') + '  ' + innerWidth + 'x' + innerHeight,
        'sun: ' + sunCore.getAttribute('cx') + ',' + sunCore.getAttribute('cy') + '  slope=' + sm.slope.toFixed(3),
        'pin ratio=' + sm.pinRatio.toFixed(3) + '  tower ratio=' + sm.towerRatio.toFixed(3) + '  H=' + sm.recoveredHeight.toFixed(1) + 'm',
        collisions.length ? 'COLLISIONS:\n  ' + collisions.join('\n  ') : 'no collisions'
      ].join('\n');
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
