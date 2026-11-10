// Связка интерфейса. Главное правило: S.src (исходная картинка) хранится всегда,
// поэтому любое изменение размера, фильтров или алгоритма пересобирает арт заново из исходника.
(function () {
  const $ = id => document.getElementById(id);
  const S = { src: null, w: 32, h: 32, res: null };
  const MAXS = 256, SLIDERS = { bright: ['Яркость', -100, 100, 0], contrast: ['Контраст', -100, 100, 0], sat: ['Насыщенность', -100, 100, 0], sharp: ['Резкость', 0, 100, 0], strength: ['Сила дизеринга', 0, 100, 70] };
  const COLORS = [['#00000000', 'Отключить'], ['#ff0000', 'Красный'], ['#00ff00', 'Зелёный'], ['#0000ff', 'Синий'], ['#ffff00', 'Жёлтый'], ['#ff00ff', 'Фиолетовый'], ['#00ffff', 'Бирюзовый'], ['#ffffff', 'Белый'], ['#000000', 'Чёрный'], ['#800000', 'Бордовый'], ['#808000', 'Оливковый'], ['#800080', 'Пурпурный'], ['#008000', 'Тёмно-зелёный'], ['#008080', 'Тёмный бирюзовый'], ['#000080', 'Тёмно-синий'], ['#ffa500', 'Оранжевый'], ['#ffc0cb', 'Розовый'], ['#a52a2a', 'Коричневый'], ['#d3d3d3', 'Светло-серый'], ['#696969', 'Тёмно-серый'], ['#4b0082', 'Индиго']];
  $('colorselect').innerHTML = COLORS.map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');
  const sl = id => { const [t, a, b, v] = SLIDERS[id]; return `<label class="rng"><span>${t}<b id="v_${id}">${v}</b></span><input type="range" id="s_${id}" min="${a}" max="${b}" value="${v}"></label>`; };
  $('slFilters').innerHTML = ['bright', 'contrast', 'sat', 'sharp'].map(sl).join('');
  $('slDither').innerHTML = sl('strength');
  $('presets').innerHTML = [16, 32, 64, 128, 256].map(n => `<button data-n="${n}">${n}</button>`).join('');

  let tt; function toast(m, bad) {
    const t = $('toast'); t.textContent = m; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(tt); tt = setTimeout(() => t.className = '', bad ? 6000 : 2500);
  }
  const num = id => +$(id).value;
  const opts = () => ({ x: parseInt($('expX').value) || 0, z: parseInt($('expZ').value) || 0, y: $('expY').value.trim() || '?', flip: $('expFlip').checked, skip: $('expSkip').checked });
  const procOpts = () => ({ fit: $('fit').value, algo: $('algo').value, metric: $('metric').value, dither: $('dither').value, strength: num('s_strength') / 100, bright: num('s_bright'), contrast: num('s_contrast'), sat: num('s_sat'), sharp: num('s_sharp'), auto: $('auto').checked, gray: $('gray').checked });

  function info() {
    const el = $('expInfo'), o = opts(), err = BS.Exporter.validate(o, S.w, S.h);
    let cnt = 0; if (S.res) for (const k of S.res.grid) if (k >= 0) cnt++;
    el.className = err.length ? 'bad' : 'good';
    el.innerHTML = err.length ? err.join('<br>') : `Блоков: <b>${cnt}</b> · x ${o.x}…${o.x + S.w - 1}, z ${o.z}…${o.z + S.h - 1} ✓`;
    $('downloadTxt').disabled = !!err.length || !S.res;
  }
  function reprocess() {
    if (!S.src) return;
    try { S.res = BS.Processor.run(S.src, S.w, S.h, procOpts()); }
    catch (e) { console.error(e); return toast('Не удалось прочитать пиксели. Откройте страницу через сервер (GitHub Pages или «python -m http.server»), а не двойным кликом по файлу.', true); }
    const tc = $('temp_canvas'); tc.width = S.w; tc.height = S.h; tc.getContext('2d').drawImage(S.res.step, 0, 0);
    $('sizeVal').textContent = `${S.w}×${S.h}`;
    BS.Viewer.setGrid(S.res.grid, S.w, S.h); info();
  }
  let dt; const later = () => { clearTimeout(dt); dt = setTimeout(reprocess, 90); };
  function setSource(canvas, url) { S.src = canvas; $('myimg').src = url; reprocess(); }

  /* размеры */
  const clamp = v => Math.min(MAXS, Math.max(1, Math.round(v) || 1));
  function setSize(w, h) { S.w = clamp(w); S.h = clamp(h); $('szW').value = S.w; $('szH').value = S.h; reprocess(); }
  const ratio = () => S.src ? S.src.width / S.src.height : 1;
  $('szW').addEventListener('change', () => setSize(num('szW'), $('szLock').checked ? num('szW') / ratio() : num('szH')));
  $('szH').addEventListener('change', () => setSize($('szLock').checked ? num('szH') * ratio() : num('szW'), num('szH')));
  $('presets').addEventListener('click', e => {
    const n = +e.target.dataset.n; if (!n) return;
    if ($('szLock').checked) { const r = ratio(); r >= 1 ? setSize(n, n / r) : setSize(n * r, n); } else setSize(n, n);
    toast(`Пересобрано: ${S.w}×${S.h}`);
  });
  $('szLock').addEventListener('change', () => { if ($('szLock').checked) setSize(S.w, S.w / ratio()); });

  /* параметры обработки */
  ['fit', 'algo', 'metric', 'dither', 'auto', 'gray'].forEach(id => $(id).addEventListener('change', reprocess));
  document.querySelectorAll('.rng input').forEach(r => {
    r.addEventListener('input', () => { $('v_' + r.id.slice(2)).textContent = r.value; later(); });
    r.addEventListener('dblclick', () => { r.value = SLIDERS[r.id.slice(2)][3]; r.dispatchEvent(new Event('input')); });
  });
  $('resetFilters').addEventListener('click', () => {
    ['bright', 'contrast', 'sat', 'sharp'].forEach(id => { $('s_' + id).value = SLIDERS[id][3]; $('v_' + id).textContent = SLIDERS[id][3]; });
    $('auto').checked = $('gray').checked = false; reprocess();
  });
  $('acceptbutton').addEventListener('click', () => { reprocess(); toast('Готово!'); });
  $('colorselect').addEventListener('change', e => BS.Viewer.setGridColor(e.target.value));
  $('fitbutton').addEventListener('click', () => BS.Viewer.fit());
  ['expX', 'expZ', 'expY', 'expFlip', 'expSkip'].forEach(id => $(id).addEventListener('input', info));

  $('memberfile').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try { const r = await BS.Crop.ask(f, S.w / S.h); if (r) setSource(r.canvas, r.url); }
    catch { toast('Не удалось открыть картинку', true); }
  });

  function save(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); }
  $('downloadButton').addEventListener('click', () => {
    if (!S.res) return;
    try { BS.Viewer.pngCanvas().toBlob(b => save(b, `art_${S.w}x${S.h}.png`)); } catch { toast('Сохранение PNG требует запуска через сервер', true); }
  });
  $('downloadTxt').addEventListener('click', () => {
    const o = opts(), err = BS.Exporter.validate(o, S.w, S.h); if (err.length) return toast(err[0], true);
    const r = BS.Exporter.build(S.res.grid, S.w, S.h, o);
    save(new Blob([r.text], { type: 'text/plain;charset=utf-8' }), `art_${S.w}x${S.h}.txt`);
    toast(`Сохранено: ${r.count} блоков, ${(r.text.length / 1024).toFixed(1)} КБ`);
  });

  BS.Viewer.init($('control_canvas'), $('final_canvas2'), h => {
    const el = $('hud'); if (!h) { el.textContent = '—'; return; }
    const o = opts(), b = h.k >= 0 ? BS.BLOCKS[h.k] : null;
    el.textContent = `x:${o.x + h.i} z:${o.z + (o.flip ? S.h - 1 - h.j : h.j)} · ${b ? b.name + ' (' + b.id + ')' : 'AIR'}`;
  });
  BS.Textures.init().then(() => {
    const img = new Image();
    img.onload = () => setSource(BS.Crop.centerSquare(img), 'bsart.png');
    img.src = 'bsart.png';
  });
})();
