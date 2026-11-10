// Загрузка и кэш текстур: simpatlas/ — настоящие блоки 32×32, rgb/ — цвет блока 1×1 (миникарта)
(function () {
  const dirs = { sa: 'simpatlas/', rgb: 'rgb/' }, cache = { sa: {}, rgb: {} };
  const load = (kind, file) => new Promise(res => {
    const i = new Image();
    i.onload = () => { cache[kind][file] = i; res(); };
    i.onerror = () => { console.warn('нет текстуры', dirs[kind] + file); res(); };
    i.src = dirs[kind] + file;
  });
  BS.Textures = {
    init() { return Promise.all(BS.BLOCKS.flatMap(b => [load('sa', b.file), load('rgb', b.file)])); },
    block: b => cache.sa[b.file],
    rgb: b => cache.rgb[b.file]
  };
})();
