// Связка интерфейса. Главное правило: S.src (исходная картинка) хранится всегда,
// поэтому любое изменение размера/дизеринга пересобирает арт заново из исходника.
(function () {
  const $ = id => document.getElementById(id);
  const S = { src: null, size: +$('pixelSlider').value, res: null };
  const COLORS = [['#00000000', 'Отключить'], ['#ff0000', 'Красный'], ['#00ff00', 'Зелёный'], ['#0000ff', 'Синий'], ['#ffff00', 'Жёлтый'], ['#ff00ff', 'Фиолетовый'], ['#00ffff', 'Бирюзовый'], ['#ffffff', 'Белый'], ['#000000', 'Чёрный'], ['#800000', 'Бордовый'], ['#808000', 'Оливковый'], ['#800080', 'Пурпурный'], ['#008000', 'Тёмно-зелёный'], ['#008080', 'Тёмный бирюзовый'], ['#000080', 'Тёмно-синий'], ['#ffa500', 'Оранжевый'], ['#ffc0cb', 'Розовый'], ['#a52a2a', 'Коричневый'], ['#d3d3d3', 'Светло-серый'], ['#696969', 'Тёмно-серый'], ['#4b0082', 'Индиго']];
  $('colorselect').innerHTML = COLORS.map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');

  let tt; function toast(m, bad) {
    const t = $('toast'); t.textContent = m; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(tt); tt = setTimeout(() => t.className = '', bad ? 6000 : 2500);
  }
  const opts = () => ({ x: parseInt($('expX').value) || 0, z: parseInt($('expZ').value) || 0, y: $('expY').value.trim() || '?', flip: $('expFlip').checked, skip: $('expSkip').checked });

  function info() {
    const el = $('expInfo'), o = opts(), n = S.size, err = BS.Exporter.validate(o, n);
    let cnt = 0; if (S.res) for (const k of S.res.grid) if (k >= 0) cnt++;
    el.className = err.length ? 'bad' : 'good';
    el.innerHTML = err.length ? err.join('<br>') : `Блоков: <b>${cnt}</b> · x ${o.x}…${o.x + n - 1}, z ${o.z}…${o.z + n - 1} ✓`;
    $('downloadTxt').disabled = !!err.length || !S.res;
  }

  function reprocess() {
    if (!S.src) return;
    try { S.res = BS.Processor.run(S.src, S.size, { dither: $('ditherChk').checked }); }
    catch (e) { console.error(e); return toast('Не удалось прочитать пиксели. Откройте страницу через сервер (GitHub Pages или «python -m http.server»), а не двойным кликом по файлу.', true); }
    const tc = $('temp_canvas'); tc.width = tc.height = S.size; tc.getContext('2d').drawImage(S.res.step, 0, 0);
    $('pixelSlider_val').textContent = `${S.size}×${S.size}`;
    BS.Viewer.setGrid(S.res.grid, S.size); info();
  }
  function setSource(canvas, url) { S.src = canvas; $('myimg').src = url; reprocess(); }

  $('pixelSlider').addEventListener('change', e => { S.size = +e.target.value; reprocess(); toast(`Пересобрано: ${S.size}×${S.size}`); });
  $('ditherChk').addEventListener('change', reprocess);
  $('acceptbutton').addEventListener('click', () => { reprocess(); toast('Готово!'); });
  $('colorselect').addEventListener('change', e => BS.Viewer.setGridColor(e.target.value));
  $('fitbutton').addEventListener('click', () => BS.Viewer.fit());
  ['expX', 'expZ', 'expY', 'expFlip', 'expSkip'].forEach(id => $(id).addEventListener('input', info));

  $('memberfile').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try { const r = await BS.Crop.ask(f); if (r) setSource(r.canvas, r.url); }
    catch { toast('Не удалось открыть картинку', true); }
  });

  function save(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); }
  $('downloadButton').addEventListener('click', () => {
    if (!S.res) return;
    try { BS.Viewer.pngCanvas().toBlob(b => save(b, `art_${S.size}x${S.size}.png`)); } catch { toast('Сохранение PNG требует запуска через сервер', true); }
  });
  $('downloadTxt').addEventListener('click', () => {
    const o = opts(), err = BS.Exporter.validate(o, S.size); if (err.length) return toast(err[0], true);
    const r = BS.Exporter.build(S.res.grid, S.size, o);
    save(new Blob([r.text], { type: 'text/plain;charset=utf-8' }), `art_${S.size}x${S.size}.txt`);
    toast(`Сохранено: ${r.count} блоков, ${(r.text.length / 1024).toFixed(1)} КБ`);
  });

  BS.Viewer.init($('control_canvas'), $('final_canvas2'), h => {
    const el = $('hud'); if (!h) { el.textContent = '—'; return; }
    const o = opts(), b = h.k >= 0 ? BS.BLOCKS[h.k] : null;
    el.textContent = `x:${o.x + h.i} z:${o.z + (o.flip ? S.size - 1 - h.j : h.j)} · ${b ? b.name + ' (' + b.id + ')' : 'AIR'}`;
  });

  BS.Textures.init().then(() => {
    const img = new Image();
    img.onload = () => setSource(BS.Crop.centerSquare(img), 'bsart.png');
    img.src = 'bsart.png';
  });
})();
