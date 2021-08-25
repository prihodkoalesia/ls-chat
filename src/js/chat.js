import WS from './ws';
import User from "./user";
import RenderBlock from "./render";
import Message from "./message";
import Photo from "./photo";

export default class Chat {
    constructor() {
        this.ws = new WS(
            this.socketOnMessage.bind(this)
        );

        this.user = new User();
        this.userPhoto = new Photo(
            document.querySelector('[data-role=user-photo]'),
            this.upload.bind(this)
        );
        this.loginWindow = new RenderBlock(document.querySelector('.login'));
        this.chatWindow = new RenderBlock(document.querySelector('.chat'));
        this.photoWindow = new RenderBlock(document.querySelector('.photo'));
        this.messageField = new Message(document.querySelector('.chat__body'));

        document.addEventListener('click', (e) => {
            if (e.target.dataset.role === 'auth') {
                const loginInput = document.querySelector('[data-role="login"]');
                const name = loginInput.value;
                this.ws.connect().then(() => {
                    this.ws.sendMessage({'type': 'login', 'user': name});
                    this.user.setName(name);
                    this.userPhoto.setPhoto(name);
                    this.loginWindow.hide();
                    this.chatWindow.show();
                    loginInput.value = '';
                })
            }

            if (e.target.dataset.role === 'sent') {
                const mesInput = document.querySelector('[data-role="message"]');
                if (mesInput.value) {
                    this.ws.sendMessage({'type': 'text', 'user': this.user.getName(), 'text': mesInput.value});
                    mesInput.value = '';
                }
            }
        });

        document.querySelector('#current-user').addEventListener('click', () => {
            this.photoWindow.show();
            this.chatWindow.hide();
        });
        document.querySelector('[data-role="reset-photo"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.photoWindow.hide();
            this.chatWindow.show();
        })
    }

    socketOnMessage(data) {
        console.log(data);
        const type = data.type;
        if (type) {
            switch (type) {
                case 'user-list':
                    for (const name of data.data) {
                        this.user.addToList(name);
                    }
                    break;
                case 'login':
                    this.user.addToList(data.from);
                    this.messageField.addSystemMessageToChat({'text': `${data.from}  зашел в чат`});
                    break;
                case 'logout':
                    this.user.deleteFromList(data.from);
                    this.messageField.addSystemMessageToChat({'text': `${data.from}  покинул чат`});
                    break;
                case 'text':
                    this.messageField.addMessageToChat({'name': data.from, 'text': data.text})
                    break;

            }
        }

    }

    upload(data) {
        fetch('http://localhost:8282/upload', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                name: this.user.getName(),
                image: data,
            }),
        })
            .then(response => {
                this.photoWindow.hide();
                this.userPhoto.setPhoto(this.user.getName());
                this.chatWindow.show();
            })
            .catch(err => console.error(err));
    }
};
