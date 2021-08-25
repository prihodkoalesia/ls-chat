export default class Photo {
    constructor(element, upload) {
        this.element = element;
        this.upload = upload;
        this.input = document.querySelector('[data-role="photo-input"]');
        this.tempPhoto = document.querySelector('label[for="photo"]');

        const fileReader = new FileReader();
        this.input.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 300 * 1024) {
                    alert('Слишком большой файл');
                } else {
                    fileReader.readAsDataURL(file);
                }
            }
        });
        fileReader.addEventListener('load', () => {
            this.fileReaderResult = fileReader.result;
            this.tempPhoto.style.backgroundImage = `url(${this.fileReaderResult})`;
            this.tempPhoto.classList.add('with-pic');
        });

        document.querySelector('[data-role="save-photo"]').addEventListener('click', (e) => {
            e.preventDefault();
            if (fileReader.result) {
                this.upload(fileReader.result);
            }
        })
    }

    setPhoto(name) {
        this.element.style.backgroundImage = `url(/files/${name}.png?v=${Date.now()})`;
    }


}
