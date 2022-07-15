import { Client, Message, MessageLike, Server } from 'node-osc';

class Config {
    static listenPort = 9001;
}

class Sender {
    private client: Client[] = [];
    private port: number[] = [];
    private id: string[] = [];

    push(id: string, port: number) {
        const i = this.port.indexOf(port);
        if (i != -1) {
            console.warn(`#${port} IS ALREADY ASSIGNED TO ${this.id[i]}`);
            return;
        }

        this.client.push(new Client("localhost", port));
        this.port.push(port);
        this.id.push(id);

        console.log(`add    listener: ${id} #${port}`);
    }

    remove(id: string) {
        const i = this.id.indexOf(id);
        if (i === -1) {
            console.warn(`REQUESTED REMOVE ${id} BUT NOT ASSIGNED YET`)
            return;
        }
        console.log(`remove listener: ${this.id[i]} #${this.port[i]} `);
        this.client[i].close();
        this.port.splice(i, 1);
        this.id.splice(i, 1);
        this.client.splice(i, 1);
    }

    send(msg: string | Message | MessageLike) {
        this.client.forEach(c => {
            c.send(msg);
        })
    }
}

function main() {
    const oscServer = new Server(Config.listenPort, '127.0.0.1');
    const proxySender: Sender = new Sender;

    oscServer.on("error", (err) => {
        console.error(err);
    })

    oscServer.on('message', (msg) => {
        const path = msg[0];
        console.log(msg.toString());
        if (path === "/Hub/regist") {
            proxySender.push(msg[1] as string, parseInt(msg[2] as string));
        } else if (path === "/Hub/unregist") {
            proxySender.remove(msg[1] as string);
        } else {
            proxySender.send(msg);
        }
    });
}

main();