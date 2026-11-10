// Меню блоков: включить/исключить блоки, фильтр по «ряби» текстуры. Выбор хранится в localStorage.
(function () {
  const B = BS.BLOCKS, KEY = 'bsart.off.v1', $ = id => document.getElementById(id);
  const active = new Uint8Array(B.length).fill(1);
  let onChange = () => {}, cards = [], sort = 'id';
  try { (JSON.parse(localStorage.getItem(KEY)) || []).forEach(id => { const k = B.findIndex(b => b.id === id); if (k >= 0) active[k] = 0; }); } catch {}
  const count = () => active.reduce((a, v) => a + v, 0);
  function changed() {
    try { localStorage.setItem(KEY, JSON.stringify(B.filter((_, k) => !active[k]).map(b => b.id))); } catch {}
    cards.forEach((c, k) => c.classList.toggle('off', !active[k]));
    const n = count(); $('openBlocks').value = `Блоки: ${n} из ${B.length}…`;
    $('blkCount').textContent = n ? `Включено ${n} из ${B.length}` : 'Ничего не включено — будут использованы все блоки';
    onChange();
  }
  function order() {
    const q = $('blkQ').value.trim().toLowerCase(), grid = $('blkGrid');
    const key = { id: k => B[k].id, noise: k => B[k].noise, light: k => B[k].rgb[0] * .3 + B[k].rgb[1] * .59 + B[k].rgb[2] * .11 }[sort];
    cards.map((_, k) => k).sort((a, b) => key(a) - key(b)).forEach(k => { cards[k].hidden = q && !(B[k].name.toLowerCase() + ' ' + B[k].id).includes(q); grid.appendChild(cards[k]); });
  }
  BS.Palette = {
    active,
    init(cb) {
      onChange = cb;
      const grid = $('blkGrid');
      cards = B.map((b, k) => {
        const c = document.createElement('button'); c.className = 'blk'; c.title = `${b.name} · рябь ${b.noise}`;
        c.innerHTML = `<img src="simpatlas/${b.file}" alt=""><b>${b.name}</b><span>${b.id} · рябь ${b.noise}</span><i style="width:${b.noise}%"></i>`;
        c.onclick = () => { active[k] ^= 1; changed(); }; return c;
      });
      $('openBlocks').onclick = () => { $('blkModal').hidden = false; };
      $('blkClose').onclick = () => { $('blkModal').hidden = true; };
      $('blkQ').oninput = order; $('blkSort').onchange = e => { sort = e.target.value; order(); };
      $('blkAll').onclick = () => { active.fill(1); changed(); };
      $('blkNone').onclick = () => { active.fill(0); changed(); };
      $('blkInv').onclick = () => { for (let k = 0; k < B.length; k++) active[k] ^= 1; changed(); };
      $('blkTh').oninput = e => { const t = +e.target.value; $('blkThV').textContent = `${t} (отключит ${B.filter(b => b.noise > t).length})`; };
      $('blkApply').onclick = () => { const t = +$('blkTh').value; B.forEach((b, k) => active[k] = b.noise <= t ? 1 : 0); changed(); };
      $('blkTh').dispatchEvent(new Event('input')); order(); changed();
    },
    exclude(k) { active[k] = 0; changed(); },
    // список «использовано в арте» с кнопкой ✕
    renderUsed(grid) {
      const cnt = new Map(); for (const k of grid) if (k >= 0) cnt.set(k, (cnt.get(k) || 0) + 1);
      $('usedList').innerHTML = [...cnt].sort((a, b) => b[1] - a[1]).map(([k, n]) => `<div class="used"><img src="simpatlas/${B[k].file}" alt=""><span>${B[k].name}</span><em>${n}</em><button data-k="${k}" title="Исключить блок и пересобрать">✕</button></div>`).join('') || '<span class="muted">Пока пусто</span>';
    }
  };
})();
