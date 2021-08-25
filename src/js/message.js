import getHtmlSysMessage from "../templates/sys_message.hbs";
import getHtmlMessage from '../templates/message.hbs';


export default class Message {
    constructor(element) {
        this.element = element;
    }

    addSystemMessageToChat(message) {
        const div = document.createElement('div');
        div.innerHTML = getHtmlSysMessage(message);
        this.element.append(div);
        this.element.scrollTop = this.element.scrollHeight;
    }

    addMessageToChat(messageObj) {
        const date = new Date()
        //messageObj.date = date.toLocaleDateString() + ' ' + date.getHours() + ':' +  date.getMinutes();
        messageObj.date = date.getHours() + ':' +  date.getMinutes();
        const div = document.createElement('div');
        div.innerHTML = getHtmlMessage(messageObj);
        this.element.append(div);
        this.element.scrollTop = this.element.scrollHeight;
    }

}