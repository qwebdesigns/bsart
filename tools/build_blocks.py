"""Генерирует js/blocks.js из tools/_BLOCKS.md и цветов в rgb/ (1x1 gif).
Запуск из корня проекта:  python tools/build_blocks.py
Правило текстур: если файла ATLAS_SIMPLE_PRAZD_<ID>.gif нет, а <ID+1> есть и ID+1 не используется в игре
(так устроены кирпичи 81, 83 … 95) — берётся файл ID+1. Блоки без текстур в палитру не попадают."""
import os, re
from PIL import Image
import numpy as np
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
md = open(os.path.join(root, 'tools', '_BLOCKS.md'), encoding='utf8').read()
blocks = [(int(i), n) for i, n in re.findall(r'^\|\s*(\d+)\s*\|\s*([A-Za-z0-9_]+)\s*\|', md, re.M)]
valid = {i for i, _ in blocks}
files = {int(re.search(r'(\d+)', f).group(1)) for f in os.listdir(os.path.join(root, 'rgb')) if f.lower().endswith('.gif')}
def noise(t):
    # «рябь» = средний перепад яркости между соседними пикселями текстуры; 25 и выше → 100
    a = np.asarray(Image.open(os.path.join(root, 'simpatlas', 'ATLAS_SIMPLE_PRAZD_%02d.gif' % t)).convert('RGB'), dtype=float) @ [.2126, .7152, .0722]
    hf = (np.abs(np.diff(a, axis=0)).mean() + np.abs(np.diff(a, axis=1)).mean()) / 2
    return int(min(100, round(hf / 25 * 100)))
rows = []
for i, n in blocks:
    t = i if i in files else (i + 1 if (i + 1) in files and (i + 1) not in valid else None)
    if t is None:
        continue
    r, g, b = Image.open(os.path.join(root, 'rgb', 'ATLAS_SIMPLE_PRAZD_%02d.gif' % t)).convert('RGB').getpixel((0, 0))
    rows.append('[%d,"%s",%d,%d,%d,%d,%d]' % (i, n, t, r, g, b, noise(t)))
js = '''// АВТОГЕНЕРАЦИЯ: python tools/build_blocks.py  (id, имя, номер текстуры, r, g, b, рябь 0–100)
window.BS = window.BS || {};
BS.BLOCKS = [
  %s
].map(([id, name, tex, r, g, b, noise]) => ({
  id, name, tex, noise, rgb: [r, g, b],
  file: 'ATLAS_SIMPLE_PRAZD_' + String(tex).padStart(2, '0') + '.gif'
}));
''' % ',\n  '.join(rows)
open(os.path.join(root, 'js', 'blocks.js'), 'w', encoding='utf8').write(js)
print('blocks:', len(rows))
