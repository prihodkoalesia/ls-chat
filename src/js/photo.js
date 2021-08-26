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
                fileReader.readAsDataURL(file);
            }
        });

        this.tempPhoto.addEventListener('dragover', (e) => {
            if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
                e.preventDefault();
            }
        });

        this.tempPhoto.addEventListener('drop', (e) => {
            const file = e.dataTransfer.items[0].getAsFile();
            if (file) {
                fileReader.readAsDataURL(file);
            }
            e.preventDefault();
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
        this.element.style.backgroundImage = `url(/files/${name}.png)`;
    }

    setAllPhoto(name) {
        this.elements = document.querySelectorAll(`[data-role="user-photo"][data-name="${name}"]`);
        console.log(this.elements);
        this.elements.forEach((element) => {
            element.style.backgroundImage = `url(/files/${name}.png?v=${Date.now()})`
        });
    }
}
