const controlCanvas = document.getElementById('control_canvas');
const finalCanvas = document.getElementById('final_canvas');
const control_ctx = controlCanvas.getContext('2d');
control_ctx.imageSmoothingEnabled = false;
var main_canvas = document.getElementById('main_canvas');
// Настройка размеров (примерные размеры, можно менять)
controlCanvas.width = 800;
controlCanvas.height = 600;
var linecolor = "#00000000";
document.getElementById('colorselect').addEventListener('change', function () {
    linecolor = this.value;
    draw();
    // Реализуйте вашу логику изменения цвета здесь
});
// Объект камеры
const camera = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0
};

// Обработчики событий
controlCanvas.addEventListener('wheel', handleWheel);
controlCanvas.addEventListener('mousedown', handleMouseDown);
controlCanvas.addEventListener('mousemove', handleMouseMove);
controlCanvas.addEventListener('mouseup', handleMouseUp);
controlCanvas.addEventListener('mouseout', handleMouseUp);

function handleWheel(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const rect = controlCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
    const newScale = camera.scale * delta;

    // Ограничения масштаба
    if (newScale < 0.1 || newScale > 10) return;

    // Корректировка смещения для сохранения позиции курсора
    camera.offsetX = mouseX - (mouseX - camera.offsetX) * (newScale / camera.scale);
    camera.offsetY = mouseY - (mouseY - camera.offsetY) * (newScale / camera.scale);

    camera.scale = newScale;
    draw();
}

function handleMouseDown(e) {
    camera.isDragging = true;
    const rect = controlCanvas.getBoundingClientRect();
    camera.lastX = e.clientX - rect.left;
    camera.lastY = e.clientY - rect.top;
}

function handleMouseMove(e) {
    if (!camera.isDragging) return;

    const rect = controlCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Вычисление дельты перемещения
    const deltaX = mouseX - camera.lastX;
    const deltaY = mouseY - camera.lastY;

    camera.offsetX += deltaX;
    camera.offsetY += deltaY;

    camera.lastX = mouseX;
    camera.lastY = mouseY;

    draw();
}

function handleMouseUp() {
    camera.isDragging = false;
}

// Функция отрисовки
function draw() {
    control_ctx.clearRect(0, 0, controlCanvas.width, controlCanvas.height);

    // Сохраняем текущее состояние контекста
    control_ctx.save();

    // Применяем трансформации камеры
    control_ctx.translate(camera.offsetX, camera.offsetY);
    control_ctx.scale(camera.scale, camera.scale);

    // Рисуем изображение из final_canvas
    control_ctx.drawImage(
        finalCanvas,
        0,
        0,
        finalCanvas.width,
        finalCanvas.height
    );

    // Рисуем сетку поверх изображения
    drawGrid();

    // Восстанавливаем состояние контекста
    control_ctx.restore();
}

const gridSize = 32; // Размер сетки
const canvasSize = controlCanvas.width; // Размер холста

function drawGrid() {
    control_ctx.strokeStyle = linecolor; // Цвет линий сетки
    control_ctx.lineWidth = 1; // Толщина линий сетки
    var line_num = main_canvas.width + 1;
    var xpos = 0
    var ypos = 0
    for (let x = 0; x <= line_num; x ++) {
        if (x < line_num){
            var end_point = line_num * gridSize - gridSize;
            control_ctx.beginPath();
            control_ctx.moveTo(xpos, 0);
            control_ctx.lineTo(xpos, end_point);
            control_ctx.stroke();
        }
        xpos += gridSize;
    }
    
    for (let y = 0; y <= line_num; y++) {
        if (y < line_num) {
            var end_point = line_num * gridSize - gridSize;
            control_ctx.beginPath();
            control_ctx.moveTo(0, ypos);
            control_ctx.lineTo(end_point, ypos);
            control_ctx.stroke();
        }
        ypos += gridSize;
    }
}

draw();



document.getElementById('memberfile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const preview = document.getElementById('myimg');
        preview.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});