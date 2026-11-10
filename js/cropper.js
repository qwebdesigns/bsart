// Свободная обрезка (любая область) с живым предпросмотром в блоках. Cropper.js с CDN; без сети — центральный квадрат.
(function () {
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/', $ = id => document.getElementById(id);
  let libP = null, cr = null, onChange = () => {}, t = 0;
  const lib = () => libP || (libP = new Promise((ok, no) => {
    if (window.Cropper) return ok();
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CDN + 'cropper.min.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = CDN + 'cropper.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  }));
  function centerSquare(img) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, s = Math.min(w, h), c = document.createElement('canvas');
    c.width = c.height = Math.min(s, 2048);
    c.getContext('2d').drawImage(img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, c.width, c.height); return c;
  }
  function emit() { // предпросмотр текущей области (уменьшенная копия — быстро)
    if (!cr) return; clearTimeout(t);
    t = setTimeout(() => { if (cr) onChange(cr.getCroppedCanvas({ maxWidth: 512, maxHeight: 512, imageSmoothingQuality: 'high' })); }, 60);
  }
  async function ask(file, opt) {
    const url = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(file); });
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    try { await lib(); } catch { return { canvas: centerSquare(img), url }; }
    onChange = opt.onChange || (() => {});
    const modal = $('cropModal'), el = $('cropImg');
    return new Promise(res => {
      modal.hidden = false; el.src = url;
      cr = new Cropper(el, { aspectRatio: NaN, viewMode: 1, autoCropArea: .9, background: false, ready: emit, crop: emit });
      const done = v => { modal.hidden = true; cr.destroy(); cr = null; res(v); };
      $('asFree').onclick = () => cr.setAspectRatio(NaN);
      $('asGrid').onclick = () => cr.setAspectRatio(opt.gridAspect());
      $('as11').onclick = () => cr.setAspectRatio(1);
      $('cropOk').onclick = () => { const c = cr.getCroppedCanvas({ maxWidth: 2048, maxHeight: 2048, imageSmoothingQuality: 'high' }); done({ canvas: c, url: c.toDataURL('image/png') }); };
      $('cropNo').onclick = () => done(null);
    });
  }
  BS.Crop = { ask, centerSquare, isOpen: () => !!cr, refresh: emit };
})();
