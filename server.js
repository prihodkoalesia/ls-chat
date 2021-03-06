const fs = require('fs');
const path = require('path');
const http = require('http');
const Index = require('ws');

function readBody(req) {
    return new Promise((resolve, reject) => {
        let dataRaw = '';

        req.on('data', (chunk) => (dataRaw += chunk));
        req.on('error', reject);
        req.on('end', () => resolve(JSON.parse(dataRaw)));
    });
}

const server = http.createServer(async (req, res) => {
    try {
        if (/\/files\/.+\.png/.test(req.url)) {
            const [, imageName] = req.url.match(/\/files\/(.+\.png)/) || [];
            const fallBackPath = path.resolve(__dirname, './files/no.png');
            const filePath = path.resolve(__dirname, './files', imageName);

            if (fs.existsSync(filePath)) {
                return fs.createReadStream(filePath).pipe(res);
            } else {
                return fs.createReadStream(fallBackPath).pipe(res);
            }
        } else if (req.url.endsWith('/upload')) {
            const body = await readBody(req);
            const name = body.name.replace(/\.\.\/|\//, '');
            const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
            const filePath = path.resolve(__dirname, './files', `${name}.png`);

            if (name && content) {
                fs.writeFileSync(filePath, content, 'base64');

                broadcast(connections, { type: 'photo-changed', data: { name } });
            } else {
                return res.end('fail');
            }
        }
        res.end('ok');
    } catch (e) {
        res.end('fail');
    }
});
const wss = new Index.Server({server});
const connections = new Map();

wss.on('connection', (socket) => {
    connections.set(socket, {});
    console.log("новое соединение");

    socket.on('message', (messageData) => {
        const message = JSON.parse(messageData);
        console.log(message);
        let excludeItself = false;

        if (message.type === 'login') {
            excludeItself = true;
            connections.get(socket).userName = message.user;
            sendMessageTo(
                {
                    type: 'user-list',
                    data: [...connections.values()].map((item) => item.userName).filter(Boolean),
                },
                socket
            );
        }

        sendMessageFrom(connections, message, socket, excludeItself);
    });

    socket.on('close', () => {
        sendMessageFrom(connections, {type: 'logout'}, socket);
        connections.delete(socket);
    });
});

function sendMessageTo(message, to) {
    to.send(JSON.stringify(message));
}

function sendMessageFrom(connections, message, from, excludeSelf) {
    const socketData = connections.get(from);

    if (!socketData) {
        return;
    }

    message.from = socketData.userName;

    for (const connection of connections.keys()) {
        if (connection === from && excludeSelf) {
            continue;
        }

        connection.send(JSON.stringify(message));
    }
}

function broadcast(connections, message) {
    for (const connection of connections.keys()) {
        connection.send(JSON.stringify(message));
    }
}

server.listen(8282);
console.log("Сервер запущен на порту 8282");
