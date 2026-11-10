// Исходная картинка (квадрат) → сетка блоков. Сетка хранит индекс в BS.BLOCKS, -1 = пусто.
(function () {
  const PAL = BS.BLOCKS.map(b => b.rgb);
  const cl = v => Math.min(255, Math.max(0, v));
  function nearest(r, g, b) { // «красное среднее» — ближе к восприятию, чем обычный RGB
    let bi = 0, bd = 1e12;
    for (let k = 0; k < PAL.length; k++) {
      const p = PAL[k], rm = (r + p[0]) / 2, dr = r - p[0], dg = g - p[1], db = b - p[2];
      const d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
      if (d < bd) { bd = d; bi = k; }
    }
    return bi;
  }
  function downscale(src, n) { // ступенчатое уменьшение вдвое — без «рваных» краёв
    let cur = src, w = src.width;
    while (w > n * 2) {
      const nw = Math.max(n, Math.floor(w / 2)), c = document.createElement('canvas');
      c.width = c.height = nw;
      const k = c.getContext('2d'); k.imageSmoothingQuality = 'high'; k.drawImage(cur, 0, 0, nw, nw);
      cur = c; w = nw;
    }
    const c = document.createElement('canvas'); c.width = c.height = n;
    const k = c.getContext('2d', { willReadFrequently: true });
    k.imageSmoothingQuality = 'high'; k.drawImage(cur, 0, 0, n, n);
    return c;
  }
  BS.Processor = {
    run(src, n, opt = {}) {
      const step = downscale(src, n), d = step.getContext('2d').getImageData(0, 0, n, n).data;
      const f = opt.dither ? Float32Array.from(d) : null, grid = new Int16Array(n * n).fill(-1);
      const spread = (x, y, e, w) => { if (x < 0 || x >= n || y >= n) return; const i = (y * n + x) * 4; for (let q = 0; q < 3; q++) f[i + q] += e[q] * w; };
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const i = (y * n + x) * 4; if (d[i + 3] < 128) continue; // прозрачное → пусто
        const r = f ? cl(f[i]) : d[i], g = f ? cl(f[i + 1]) : d[i + 1], b = f ? cl(f[i + 2]) : d[i + 2];
        const k = nearest(r, g, b); grid[y * n + x] = k;
        if (f) { const p = PAL[k], e = [r - p[0], g - p[1], b - p[2]]; spread(x + 1, y, e, 7 / 16); spread(x - 1, y + 1, e, 3 / 16); spread(x, y + 1, e, 5 / 16); spread(x + 1, y + 1, e, 1 / 16); }
      }
      return { grid, step };
    }
  };
})();
