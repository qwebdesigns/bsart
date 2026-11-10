// Картинка → сетка блоков (w×h). Этапы: подгонка → сжатие → фильтры → подбор блока (+дизеринг).
// Сетка хранит индекс в BS.BLOCKS, -1 = пусто.
(function () {
  const B = BS.BLOCKS, np = B.length;
  const ci = v => v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
  const LIN = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const c = i / 255; LIN[i] = c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }
  const lf = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  function toLab(r, g, b) {
    const R = LIN[ci(r)], G = LIN[ci(g)], Bl = LIN[ci(b)];
    const fx = lf((.4124564 * R + .3575761 * G + .1804375 * Bl) / .95047), fy = lf(.2126729 * R + .7151522 * G + .072175 * Bl), fz = lf((.0193339 * R + .119192 * G + .9503041 * Bl) / 1.08883);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }
  const flat = a => Float32Array.from(a.flat());
  // Пространства подбора. w — доля ошибки, которая уходит соседям (в Lab цветность гасится: это и убирает «фиолетовые» пиксели)
  const SP = {
    lab: { pal: flat(B.map(b => toLab(...b.rgb))), to: toLab, min: [0, -128, -128], max: [100, 128, 128], w: [1, .3, .3], maxErr: [28, 10, 10], spread: [24, 0, 0] },
    rgb: { pal: flat(B.map(b => b.rgb)), to: (r, g, b) => [r, g, b], min: [0, 0, 0], max: [255, 255, 255], w: [1, 1, 1], maxErr: [40, 40, 40], spread: [60, 60, 60] }
  };
  const K = { fs: { d: 16, k: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]] }, atk: { d: 8, k: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]] }, sl: { d: 4, k: [[1, 0, 2], [-1, 1, 1], [0, 1, 1]] } };
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  /* ---- подгонка кадра под сетку ---- */
  function region(S, w, h, fit) {
    const SW = S.width, SH = S.height, ta = w / h, sa = SW / SH;
    if (fit === 'stretch') return { sx: 0, sy: 0, sw: SW, sh: SH, dx: 0, dy: 0, dw: w, dh: h };
    if (fit === 'contain') { const k = Math.min(w / SW, h / SH), dw = Math.max(1, Math.round(SW * k)), dh = Math.max(1, Math.round(SH * k)); return { sx: 0, sy: 0, sw: SW, sh: SH, dx: (w - dw) >> 1, dy: (h - dh) >> 1, dw, dh }; }
    let sw = SW, sh = SH; if (sa > ta) sw = SH * ta; else sh = SW / ta; // cover
    return { sx: (SW - sw) / 2, sy: (SH - sh) / 2, sw, sh, dx: 0, dy: 0, dw: w, dh: h };
  }

  /* ---- алгоритмы сжатия: возвращают RGBA размера dw×dh ---- */
  const RS = {
    smooth(S, r) { // сглаживание браузера со ступенчатым уменьшением
      let c = mk(Math.max(1, Math.round(r.sw)), Math.max(1, Math.round(r.sh)));
      c.getContext('2d').drawImage(S, r.sx, r.sy, r.sw, r.sh, 0, 0, c.width, c.height);
      while (c.width > r.dw * 2 || c.height > r.dh * 2) {
        const n = mk(Math.max(r.dw, c.width >> 1), Math.max(r.dh, c.height >> 1)), k = n.getContext('2d'); k.imageSmoothingQuality = 'high'; k.drawImage(c, 0, 0, n.width, n.height); c = n;
      }
      const f = mk(r.dw, r.dh), k = f.getContext('2d', { willReadFrequently: true }); k.imageSmoothingQuality = 'high'; k.drawImage(c, 0, 0, r.dw, r.dh);
      return k.getImageData(0, 0, r.dw, r.dh).data;
    },
    area(S, r) { // точное усреднение всех пикселей ячейки
      const SW = S.width, SH = S.height, d = S.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, SW, SH).data, o = new Uint8ClampedArray(r.dw * r.dh * 4);
      const cw = r.sw / r.dw, ch = r.sh / r.dh;
      for (let y = 0; y < r.dh; y++) for (let x = 0; x < r.dw; x++) {
        const x0 = Math.floor(r.sx + x * cw), x1 = Math.min(SW, Math.max(x0 + 1, Math.ceil(r.sx + (x + 1) * cw)));
        const y0 = Math.floor(r.sy + y * ch), y1 = Math.min(SH, Math.max(y0 + 1, Math.ceil(r.sy + (y + 1) * ch)));
        let R = 0, G = 0, Bb = 0, A = 0, n = 0;
        for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) { const p = (j * SW + i) * 4, a = d[p + 3]; R += d[p] * a; G += d[p + 1] * a; Bb += d[p + 2] * a; A += a; n++; }
        const q = (y * r.dw + x) * 4; if (A > 0) { o[q] = R / A; o[q + 1] = G / A; o[q + 2] = Bb / A; } o[q + 3] = A / n;
      }
      return o;
    },
    nearest(S, r) { // ближайший пиксель — чёткий пиксель-арт
      const SW = S.width, d = S.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, SW, S.height).data, o = new Uint8ClampedArray(r.dw * r.dh * 4);
      for (let y = 0; y < r.dh; y++) for (let x = 0; x < r.dw; x++) {
        const sx = Math.min(SW - 1, Math.floor(r.sx + (x + .5) * r.sw / r.dw)), sy = Math.min(S.height - 1, Math.floor(r.sy + (y + .5) * r.sh / r.dh)), p = (sy * SW + sx) * 4, q = (y * r.dw + x) * 4;
        o[q] = d[p]; o[q + 1] = d[p + 1]; o[q + 2] = d[p + 2]; o[q + 3] = d[p + 3];
      }
      return o;
    },
    mode(S, r) { // доминирующий цвет ячейки — сохраняет контуры и мелкие детали
      const SW = S.width, SH = S.height, d = S.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, SW, SH).data, o = new Uint8ClampedArray(r.dw * r.dh * 4);
      const cnt = new Uint16Array(4096), sum = new Float32Array(4096 * 3), cw = r.sw / r.dw, ch = r.sh / r.dh, st = 8;
      for (let y = 0; y < r.dh; y++) for (let x = 0; x < r.dw; x++) {
        const used = []; let tot = 0;
        for (let j = 0; j < st; j++) for (let i = 0; i < st; i++) {
          const px = Math.min(SW - 1, Math.floor(r.sx + (x + (i + .5) / st) * cw)), py = Math.min(SH - 1, Math.floor(r.sy + (y + (j + .5) / st) * ch)), p = (py * SW + px) * 4;
          if (d[p + 3] < 128) continue; tot++;
          const k = (d[p] >> 4) << 8 | (d[p + 1] >> 4) << 4 | d[p + 2] >> 4; if (!cnt[k]) used.push(k);
          cnt[k]++; sum[k * 3] += d[p]; sum[k * 3 + 1] += d[p + 1]; sum[k * 3 + 2] += d[p + 2];
        }
        let best = -1, bc = 0; for (const k of used) if (cnt[k] > bc) { bc = cnt[k]; best = k; }
        const q = (y * r.dw + x) * 4;
        if (best >= 0 && tot >= st * st / 2) { o[q] = sum[best * 3] / bc; o[q + 1] = sum[best * 3 + 1] / bc; o[q + 2] = sum[best * 3 + 2] / bc; o[q + 3] = 255; }
        for (const k of used) { cnt[k] = 0; sum[k * 3] = sum[k * 3 + 1] = sum[k * 3 + 2] = 0; }
      }
      return o;
    }
  };

  /* ---- фильтры (на уже уменьшенном изображении) ---- */
  function filters(rgba, w, h, o) {
    const n = w * h, px = new Float32Array(n * 3), luma = (r, g, b) => .2126 * r + .7152 * g + .0722 * b;
    for (let i = 0; i < n; i++) { px[i * 3] = rgba[i * 4]; px[i * 3 + 1] = rgba[i * 4 + 1]; px[i * 3 + 2] = rgba[i * 4 + 2]; }
    if (o.auto) { // автоуровни по яркости (1–99 %), оттенок не смещается
      const hist = new Uint32Array(256); let tot = 0;
      for (let i = 0; i < n; i++) if (rgba[i * 4 + 3] >= 128) { hist[ci(luma(px[i * 3], px[i * 3 + 1], px[i * 3 + 2]))]++; tot++; }
      let lo = 0, hi = 255, s = 0; while (lo < 255 && (s += hist[lo]) < tot * .01) lo++; s = 0; while (hi > 0 && (s += hist[hi]) < tot * .01) hi--;
      if (hi - lo > 8) { const k = 255 / (hi - lo); for (let i = 0; i < n * 3; i++) px[i] = (px[i] - lo) * k; }
    }
    const C = o.contrast * 2.55, cf = (259 * (C + 255)) / (255 * (259 - C)), br = o.bright * 2.55, sat = 1 + o.sat / 100;
    for (let i = 0; i < n; i++) {
      let r = px[i * 3], g = px[i * 3 + 1], b = px[i * 3 + 2];
      r = cf * (r - 128) + 128 + br; g = cf * (g - 128) + 128 + br; b = cf * (b - 128) + 128 + br;
      const l = luma(r, g, b);
      if (o.gray) r = g = b = l; else { r = l + (r - l) * sat; g = l + (g - l) * sat; b = l + (b - l) * sat; }
      px[i * 3] = r; px[i * 3 + 1] = g; px[i * 3 + 2] = b;
    }
    if (o.sharp > 0) { // нерезкая маска 3×3
      const src = Float32Array.from(px), a = o.sharp / 100 * 1.5;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
        let s = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += src[(Math.min(h - 1, Math.max(0, y + j)) * w + Math.min(w - 1, Math.max(0, x + i))) * 3 + c];
        const p = (y * w + x) * 3 + c; px[p] = src[p] + a * (src[p] - s / 9);
      }
    }
    for (let i = 0; i < n * 3; i++) px[i] = ci(px[i]);
    return px;
  }

  /* ---- подбор блоков + дизеринг ---- */
  function match(px, alpha, w, h, o) {
    const sp = SP[o.metric] || SP.lab, P = sp.pal, grid = new Int16Array(w * h).fill(-1);
    const kern = K[o.dither], E = kern ? new Float32Array(w * h * 3) : null, st = o.strength;
    for (let y = 0; y < h; y++) {
      const rev = E && (y & 1); // змейка: чётные строки слева направо, нечётные обратно
      for (let xi = 0; xi < w; xi++) {
        const x = rev ? w - 1 - xi : xi, i = y * w + x; if (alpha[i] < 128) continue;
        const v = sp.to(px[i * 3], px[i * 3 + 1], px[i * 3 + 2]);
        if (E) for (let c = 0; c < 3; c++) v[c] = Math.min(sp.max[c], Math.max(sp.min[c], v[c] + E[i * 3 + c]));
        else if (o.dither === 'bayer') { const t = (BAY[(y & 3) * 4 + (x & 3)] / 15 - .5) * st; for (let c = 0; c < 3; c++) v[c] += t * sp.spread[c]; }
        let best = 0, bd = 1e12;
        for (let k = 0; k < np; k++) { const a = v[0] - P[k * 3], b = v[1] - P[k * 3 + 1], c = v[2] - P[k * 3 + 2], d = a * a + b * b + c * c; if (d < bd) { bd = d; best = k; } }
        grid[i] = best;
        if (E) for (let c = 0; c < 3; c++) {
          const e = Math.max(-sp.maxErr[c], Math.min(sp.maxErr[c], (v[c] - P[best * 3 + c]) * sp.w[c] * st));
          for (const [dx, dy, wt] of kern.k) { const nx = x + (rev ? -dx : dx), ny = y + dy; if (nx >= 0 && nx < w && ny < h) E[(ny * w + nx) * 3 + c] += e * wt / kern.d; }
        }
      }
    }
    return grid;
  }

  BS.Processor = {
    _match: match,
    run(src, w, h, o) {
      const r = region(src, w, h, o.fit), part = (RS[o.algo] || RS.area)(src, r), rgba = new Uint8ClampedArray(w * h * 4);
      for (let y = 0; y < r.dh; y++) for (let x = 0; x < r.dw; x++) { const p = (y * r.dw + x) * 4, q = ((y + r.dy) * w + x + r.dx) * 4; rgba[q] = part[p]; rgba[q + 1] = part[p + 1]; rgba[q + 2] = part[p + 2]; rgba[q + 3] = part[p + 3]; }
      const px = filters(rgba, w, h, o), alpha = new Uint8Array(w * h), img = new ImageData(w, h);
      for (let i = 0; i < w * h; i++) { alpha[i] = rgba[i * 4 + 3]; img.data[i * 4] = px[i * 3]; img.data[i * 4 + 1] = px[i * 3 + 1]; img.data[i * 4 + 2] = px[i * 3 + 2]; img.data[i * 4 + 3] = alpha[i] < 128 ? 0 : 255; }
      const step = mk(w, h); step.getContext('2d').putImageData(img, 0, 0);
      return { grid: match(px, alpha, w, h, o), w, h, step };
    }
  };
})();
