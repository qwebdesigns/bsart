// Обрезка фото в квадрат (Cropper.js с CDN, как в исходнике). Без сети — центральная обрезка.
(function () {
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/';
  let libP = null;
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
  async function ask(file, aspect) {
    const url = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(file); });
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    try { await lib(); } catch { return { canvas: centerSquare(img), url }; }
    const modal = document.getElementById('cropModal'), el = document.getElementById('cropImg');
    return new Promise(res => {
      modal.hidden = false; el.src = url;
      const cr = new Cropper(el, { aspectRatio: aspect || 1, viewMode: 1, autoCropArea: 1, guides: false });
      const done = v => { modal.hidden = true; cr.destroy(); res(v); };
      document.getElementById('cropOk').onclick = () => { const c = cr.getCroppedCanvas({ imageSmoothingQuality: 'high', maxWidth: 2048, maxHeight: 2048 }); done({ canvas: c, url: c.toDataURL('image/png') }); };
      document.getElementById('cropNo').onclick = () => done(null);
    });
  }
  BS.Crop = { ask, centerSquare };
})();
