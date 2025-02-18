document.getElementById('downloadButton').addEventListener('click', function () {
    const canvas = document.getElementById('final_canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'canvas_image.png';
    link.click();
});