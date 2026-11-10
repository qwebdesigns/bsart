// Главный холст: настоящие текстуры блоков, зум колесом, перетаскивание, сетка, подсказка под курсором
// Миникарта: каждый блок — картинка 1×1 из папки rgb/
(function () {
  const BL = BS.BLOCKS, cam = { x: 0, y: 0, z: 10 };
  let cv, cx, mini, mx, grid = null, N = 0, gridColor = '#00000000', hov = null, onHover = () => {}, drag = null;
  const view = () => { const d = devicePixelRatio || 1; return [cv.width / d, cv.height / d]; };
  function size() {
    const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); draw();
  }
  function fit() {
    const [W, H] = view(); cam.z = Math.max(.5, Math.min(W, H) * .94 / Math.max(N, 1));
    cam.x = (W - N * cam.z) / 2; cam.y = (H - N * cam.z) / 2; draw();
  }
  function renderMini() {
    mini.width = mini.height = N; mx.imageSmoothingEnabled = false; mx.clearRect(0, 0, N, N);
    for (let k = 0; k < grid.length; k++) {
      if (grid[k] < 0) continue;
      const im = BS.Textures.rgb(BL[grid[k]]); if (im) mx.drawImage(im, k % N, (k / N) | 0, 1, 1);
    }
  }
  function draw() {
    const d = devicePixelRatio || 1, [W, H] = view(), z = cam.z;
    cx.setTransform(d, 0, 0, d, 0, 0); cx.clearRect(0, 0, W, H); cx.imageSmoothingEnabled = false;
    if (!grid) return;
    const i0 = Math.max(0, Math.floor(-cam.x / z)), i1 = Math.min(N - 1, Math.floor((W - cam.x) / z));
    const j0 = Math.max(0, Math.floor(-cam.y / z)), j1 = Math.min(N - 1, Math.floor((H - cam.y) / z));
    if (z >= 5) { // крупно — рисуем только видимые блоки настоящими текстурами
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const k = grid[j * N + i]; if (k < 0) continue;
        const im = BS.Textures.block(BL[k]); if (!im) continue;
        const x0 = Math.round(cam.x + i * z), y0 = Math.round(cam.y + j * z);
        cx.drawImage(im, x0, y0, Math.round(cam.x + (i + 1) * z) - x0, Math.round(cam.y + (j + 1) * z) - y0);
      }
    } else cx.drawImage(mini, cam.x, cam.y, N * z, N * z); // мелко — цвета из rgb/
    if (z >= 4 && gridColor !== '#00000000') {
      cx.strokeStyle = gridColor; cx.lineWidth = 1; cx.beginPath();
      for (let i = i0; i <= i1 + 1; i++) { const x = Math.round(cam.x + i * z) + .5; cx.moveTo(x, Math.max(0, cam.y)); cx.lineTo(x, Math.min(H, cam.y + N * z)); }
      for (let j = j0; j <= j1 + 1; j++) { const y = Math.round(cam.y + j * z) + .5; cx.moveTo(Math.max(0, cam.x), y); cx.lineTo(Math.min(W, cam.x + N * z), y); }
      cx.stroke();
    }
    cx.strokeStyle = '#ffb13b'; cx.lineWidth = 2; cx.strokeRect(cam.x - 1, cam.y - 1, N * z + 2, N * z + 2);
    if (hov) { cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.strokeRect(cam.x + hov[0] * z, cam.y + hov[1] * z, z, z); }
  }
  function cellAt(e) {
    const r = cv.getBoundingClientRect(), i = Math.floor((e.clientX - r.left - cam.x) / cam.z), j = Math.floor((e.clientY - r.top - cam.y) / cam.z);
    return i >= 0 && j >= 0 && i < N && j < N ? [i, j] : null;
  }
  BS.Viewer = {
    init(canvas, miniCanvas, hoverCb) {
      cv = canvas; cx = cv.getContext('2d'); mini = miniCanvas; mx = mini.getContext('2d'); onHover = hoverCb;
      new ResizeObserver(size).observe(cv.parentElement);
      cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; cv.style.cursor = 'grabbing'; });
      cv.addEventListener('pointermove', e => {
        if (drag) { cam.x = drag.cx + e.clientX - drag.x; cam.y = drag.cy + e.clientY - drag.y; }
        hov = cellAt(e); onHover(hov && grid ? { i: hov[0], j: hov[1], k: grid[hov[1] * N + hov[0]] } : null); draw();
      });
      const up = () => { drag = null; cv.style.cursor = 'grab'; };
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      cv.addEventListener('pointerleave', () => { hov = null; onHover(null); draw(); });
      cv.addEventListener('dblclick', fit);
      cv.addEventListener('wheel', e => {
        e.preventDefault(); const r = cv.getBoundingClientRect(), mxp = e.clientX - r.left, myp = e.clientY - r.top;
        const nz = Math.min(128, Math.max(.5, cam.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        cam.x = mxp - (mxp - cam.x) * nz / cam.z; cam.y = myp - (myp - cam.y) * nz / cam.z; cam.z = nz; draw();
      }, { passive: false });
      size();
    },
    setGrid(g, n) { const changed = n !== N; grid = g; N = n; renderMini(); changed ? fit() : draw(); },
    setGridColor(c) { gridColor = c; draw(); },
    fit,
    pngCanvas() { // полноразмерная картинка из текстур
      const cell = N > 128 ? 16 : 32, c = document.createElement('canvas'); c.width = c.height = N * cell;
      const k = c.getContext('2d'); k.imageSmoothingEnabled = false;
      for (let q = 0; q < grid.length; q++) { if (grid[q] < 0) continue; const im = BS.Textures.block(BL[grid[q]]); if (im) k.drawImage(im, (q % N) * cell, ((q / N) | 0) * cell, cell, cell); }
      return c;
    }
  };
})();
