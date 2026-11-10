// Главный холст: настоящие текстуры блоков, зум колесом, перетаскивание, сетка, подсказка под курсором
// Миникарта: каждый блок — картинка 1×1 из папки rgb/
(function () {
  const BL = BS.BLOCKS, cam = { x: 0, y: 0, z: 10 };
  let cv, cx, mini, mx, grid = null, GW = 0, GH = 0, gridColor = '#00000000', hov = null, onHover = () => {}, drag = null;
  const view = () => { const d = devicePixelRatio || 1; return [cv.width / d, cv.height / d]; };
  function size() {
    const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); draw();
  }
  function fit() {
    const [W, H] = view(); cam.z = Math.max(.5, Math.min(W / Math.max(GW, 1), H / Math.max(GH, 1)) * .94);
    cam.x = (W - GW * cam.z) / 2; cam.y = (H - GH * cam.z) / 2; draw();
  }
  function renderMini() {
    mini.width = GW; mini.height = GH; mx.imageSmoothingEnabled = false; mx.clearRect(0, 0, GW, GH);
    for (let k = 0; k < grid.length; k++) {
      if (grid[k] < 0) continue;
      const im = BS.Textures.rgb(BL[grid[k]]); if (im) mx.drawImage(im, k % GW, (k / GW) | 0, 1, 1);
    }
  }
  function draw() {
    const d = devicePixelRatio || 1, [W, H] = view(), z = cam.z;
    cx.setTransform(d, 0, 0, d, 0, 0); cx.clearRect(0, 0, W, H); cx.imageSmoothingEnabled = false;
    if (!grid) return;
    const i0 = Math.max(0, Math.floor(-cam.x / z)), i1 = Math.min(GW - 1, Math.floor((W - cam.x) / z));
    const j0 = Math.max(0, Math.floor(-cam.y / z)), j1 = Math.min(GH - 1, Math.floor((H - cam.y) / z));
    if (z >= 5) { // крупно — рисуем только видимые блоки настоящими текстурами
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const k = grid[j * GW + i]; if (k < 0) continue;
        const im = BS.Textures.block(BL[k]); if (!im) continue;
        const x0 = Math.round(cam.x + i * z), y0 = Math.round(cam.y + j * z);
        cx.drawImage(im, x0, y0, Math.round(cam.x + (i + 1) * z) - x0, Math.round(cam.y + (j + 1) * z) - y0);
      }
    } else cx.drawImage(mini, cam.x, cam.y, GW * z, GH * z); // мелко — цвета из rgb/
    if (z >= 4 && gridColor !== '#00000000') {
      cx.strokeStyle = gridColor; cx.lineWidth = 1; cx.beginPath();
      for (let i = i0; i <= i1 + 1; i++) { const x = Math.round(cam.x + i * z) + .5; cx.moveTo(x, Math.max(0, cam.y)); cx.lineTo(x, Math.min(H, cam.y + GH * z)); }
      for (let j = j0; j <= j1 + 1; j++) { const y = Math.round(cam.y + j * z) + .5; cx.moveTo(Math.max(0, cam.x), y); cx.lineTo(Math.min(W, cam.x + GW * z), y); }
      cx.stroke();
    }
    cx.strokeStyle = '#ffb13b'; cx.lineWidth = 2; cx.strokeRect(cam.x - 1, cam.y - 1, GW * z + 2, GH * z + 2);
    if (hov) { cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.strokeRect(cam.x + hov[0] * z, cam.y + hov[1] * z, z, z); }
  }
  function cellAt(e) {
    const r = cv.getBoundingClientRect(), i = Math.floor((e.clientX - r.left - cam.x) / cam.z), j = Math.floor((e.clientY - r.top - cam.y) / cam.z);
    return i >= 0 && j >= 0 && i < GW && j < GH ? [i, j] : null;
  }
  BS.Viewer = {
    init(canvas, miniCanvas, hoverCb) {
      cv = canvas; cx = cv.getContext('2d'); mini = miniCanvas; mx = mini.getContext('2d'); onHover = hoverCb;
      new ResizeObserver(size).observe(cv.parentElement);
      cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; cv.style.cursor = 'grabbing'; });
      cv.addEventListener('pointermove', e => {
        if (drag) { cam.x = drag.cx + e.clientX - drag.x; cam.y = drag.cy + e.clientY - drag.y; }
        hov = cellAt(e); onHover(hov && grid ? { i: hov[0], j: hov[1], k: grid[hov[1] * GW + hov[0]] } : null); draw();
      });
      const up = () => { drag = null; cv.style.cursor = 'grab'; };
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      cv.addEventListener('pointerleave', () => { hov = null; onHover(null); draw(); });
      cv.addEventListener('dblclick', fit);
      cv.addEventListener('contextmenu', e => { e.preventDefault(); const c = cellAt(e); if (c && grid[c[1] * GW + c[0]] >= 0 && BS.Viewer.onExclude) BS.Viewer.onExclude(grid[c[1] * GW + c[0]]); });
      cv.addEventListener('wheel', e => {
        e.preventDefault(); const r = cv.getBoundingClientRect(), mxp = e.clientX - r.left, myp = e.clientY - r.top;
        const nz = Math.min(128, Math.max(.5, cam.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        cam.x = mxp - (mxp - cam.x) * nz / cam.z; cam.y = myp - (myp - cam.y) * nz / cam.z; cam.z = nz; draw();
      }, { passive: false });
      size();
    },
    setGrid(g, w, h) { const changed = w !== GW || h !== GH; grid = g; GW = w; GH = h; renderMini(); changed ? fit() : draw(); },
    setGridColor(c) { gridColor = c; draw(); },
    fit,
    preview(c, g, w, h) { // рисует блоки в любой canvas (предпросмотр при обрезке)
      const cell = Math.max(1, Math.floor(Math.min(520 / w, 520 / h)));
      c.width = w * cell; c.height = h * cell; const k = c.getContext('2d'); k.imageSmoothingEnabled = false;
      for (let q = 0; q < g.length; q++) {
        if (g[q] < 0) continue; const b = BL[g[q]], im = cell >= 4 ? BS.Textures.block(b) : BS.Textures.rgb(b);
        if (im) k.drawImage(im, (q % w) * cell, ((q / w) | 0) * cell, cell, cell);
      }
    },
    pngCanvas() { // полноразмерная картинка из текстур
      const cell = Math.max(GW, GH) > 128 ? 16 : 32, c = document.createElement('canvas'); c.width = GW * cell; c.height = GH * cell;
      const k = c.getContext('2d'); k.imageSmoothingEnabled = false;
      for (let q = 0; q < grid.length; q++) { if (grid[q] < 0) continue; const im = BS.Textures.block(BL[grid[q]]); if (im) k.drawImage(im, (q % GW) * cell, ((q / GW) | 0) * cell, cell, cell); }
      return c;
    }
  };
})();
