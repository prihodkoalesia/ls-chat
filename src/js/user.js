import getHtmlList from '../templates/list.hbs';

export default class User {
    constructor() {
        this.nameField = document.querySelector('[data-role="current-user-name"]');
        this.items = new Set();
    }

    setName(name) {
        this.name = name;
        this.nameField.textContent = name;
    }

    getName() {
        return this.name;
    }

    renderList() {
        document.querySelector('.chat__users-list').innerHTML = getHtmlList({list: this.items});
        this.setCount();
    }

    setCount() {
        const count = this.items.size;
        const countText = this.declOfNum(count, ['участник', 'участника', 'участников']);
        document.querySelector('#count').textContent = count + ' ' + countText;
    }

    addToList(name) {
        this.items.add(name);
        this.renderList();
    }

    deleteFromList(name) {
        this.items.delete(name);
        this.renderList();
    }

    declOfNum(n, text_forms) {
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) {
            return text_forms[2];
        }
        if (n1 > 1 && n1 < 5) {
            return text_forms[1];
        }
        if (n1 == 1) {
            return text_forms[0];
        }
        return text_forms[2];
    }
}