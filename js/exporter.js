// Формат для бота: JSON-массив {"x","y","z","block"}. BOM + CRLF, z снаружи, x внутри — как в art_32x32.txt
// Допустимые координаты: 0…255 включительно (-1 и 256 запрещены). z=0 — нижняя строка арта.
(function () {
  const isNum = s => /^-?\d+$/.test(s);
  BS.Exporter = {
    validate(o, w, h) {
      const e = [];
      if (o.x < 0 || o.x + w - 1 > 255) e.push(`X: ${o.x}…${o.x + w - 1} выходит за 0–255`);
      if (o.z < 0 || o.z + h - 1 > 255) e.push(`Z: ${o.z}…${o.z + h - 1} выходит за 0–255`);
      if (isNum(o.y) && (+o.y < 0 || +o.y > 255)) e.push('Y: число 0–255 или «?»');
      return e;
    },
    build(grid, w, h, o) {
      const y = isNum(o.y) ? String(+o.y) : JSON.stringify(o.y), L = [];
      for (let r = 0; r < h; r++) {
        const z = o.z + (o.flip ? h - 1 - r : r);
        for (let c = 0; c < w; c++) {
          const k = grid[r * w + c]; if (k < 0 && o.skip) continue;
          L.push(`  {"x":${o.x + c},"y":${y},"z":${z},"block":"${k < 0 ? 'AIR' : BS.BLOCKS[k].name}"}`);
        }
      }
      return { text: '\uFEFF[\r\n\r\n' + L.join(',\r\n') + '\r\n]\r\n\r\n', count: L.length };
    }
  };
})();
