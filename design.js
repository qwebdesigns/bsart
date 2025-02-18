document.getElementById('downloadButton').addEventListener('click', function () {
    const canvas = document.getElementById('final_canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'canvas_image.png';
    link.click();
});

















if (!window.Cropper) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js';
    script.onload = initCropper;
    document.head.appendChild(script);
} else {
    initCropper();
}

let cropper = null;

function initCropper() {
    const fileInput = document.getElementById('memberfile');
    const resultContainer = document.getElementById('result-container');
    const cropModal = document.createElement('div');

    // Стили модального окна
    Object.assign(cropModal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: '10000',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center'
    });

    // Контейнер для обрезки с ограничениями
    const cropBox = document.createElement('div');
    Object.assign(cropBox.style, {
        maxWidth: '90vw',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
    });

    const cropImage = document.createElement('img');

    // Панель управления
    const controls = document.createElement('div');
    Object.assign(controls.style, {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: '10001'
    });

    const createButton = (text, bgColor) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '12px 25px',
            backgroundColor: bgColor,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        return btn;
    };

    const cropButton = createButton('Обрезать', '#4CAF50');
    const cancelButton = createButton('Отмена', '#f44336');

    // Сборка структуры
    controls.append(cropButton, cancelButton);
    cropBox.append(cropImage, controls);
    cropModal.append(cropBox);
    document.body.append(cropModal);

    // Обработчик файла
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            cropImage.src = event.target.result;

            if (cropper) cropper.destroy();

            cropImage.onload = () => {
                // Автоматический расчет размеров
                const maxWidth = window.innerWidth * 0.9;
                const maxHeight = window.innerHeight * 0.9;
                const ratio = Math.min(
                    maxWidth / cropImage.naturalWidth,
                    maxHeight / cropImage.naturalHeight,
                    1
                );

                Object.assign(cropBox.style, {
                    width: `${cropImage.naturalWidth * ratio}px`,
                    height: `${cropImage.naturalHeight * ratio}px`
                });

                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 1,
                    responsive: true,
                    movable: true,
                    zoomable: true,
                    guides: false,
                    ready() {
                        this.cropper.setCropBoxData({
                            width: this.cropper.getContainerData().width,
                            height: this.cropper.getContainerData().height
                        });
                    }
                });

                cropModal.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    });

    // Обработчики кнопок
    cropButton.addEventListener('click', () => {
        const canvas = cropper.getCroppedCanvas({
            imageSmoothingQuality: 'high'
        });
        document.getElementById('myimg').src = canvas.toDataURL('image/jpeg', 0.95);
        //resultContainer.innerHTML = `<img src="${canvas.toDataURL('image/jpeg', 0.9)}" 
        //    style="max-width:100%; max-height:80vh;">`;
        cropModal.style.display = 'none';
        cropper.destroy();
        fileInput.value = '';
    });

    cancelButton.addEventListener('click', () => {
        cropModal.style.display = 'none';
        cropper.destroy();
        fileInput.value = '';
    });
}