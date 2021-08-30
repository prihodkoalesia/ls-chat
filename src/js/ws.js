export default class WS {
    constructor(socketOnMessage) {
        this.socketOnMessage = socketOnMessage;
    }

    connect() {
        return new Promise((resolve) => {
            this.socket = new WebSocket("ws://localhost:8282/ws");
            this.socket.addEventListener('open', resolve);
            this.socket.addEventListener('message',  (event) => {
                this.socketOnMessage(JSON.parse(event.data));
            });
        })
    }

    sendMessage(data) {
        //console.log(data);
        this.socket.send(
            JSON.stringify(data)
        );
    }
}
