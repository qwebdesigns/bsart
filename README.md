# BSArt

Фото → арт из блоков BLOCKADE → файл с координатами и типами блоков для бота.

Открывать через сервер (иначе браузер не даёт читать пиксели картинок):
`python -m http.server` в этой папке, затем http://localhost:8000 — или GitHub Pages.

```
index.html          страница
css/style.css       стили
js/blocks.js        палитра: id, имя, текстура, цвет (генерируется)
js/textures.js      загрузка simpatlas/ (блоки 32×32) и rgb/ (цвет 1×1)
js/processor.js     картинка → сетка блоков (подбор ближайшего цвета, дизеринг)
js/viewer.js        главный холст, миникарта, зум/панорама, сетка
js/exporter.js      формат .txt для бота (0…255, BOM, CRLF)
js/cropper.js       обрезка фото в квадрат
js/main.js          связка интерфейса
tools/build_blocks.py  пересборка js/blocks.js из tools/_BLOCKS.md и rgb/
```
