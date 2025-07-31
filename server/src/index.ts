import { Elysia } from "elysia";
import { type ChatEvent, ChatRequest, ChatResponse, Event } from "./chat/model";

class Users {
    #userMap: Map<string, number>;
    #newUserId: number = 0;

    constructor() {
        this.#userMap = new Map();
    }

    createUser(id: string) {
        this.#newUserId++;

        this.#userMap.set(id, this.#newUserId);

        return this.#newUserId;
    }

    removeUser(id: string) {
        const userId = this.#userMap.get(id);
        const success = this.#userMap.delete(id);

        return success && userId ? userId : -1;
    }

    getUser(id: string) {
        return this.#userMap.get(id);
    }

    getCount() {
        return this.#userMap.size;
    }
}

const app = new Elysia({
    websocket: {
        idleTimeout: 30,
        maxPayloadLength: 64 * 1024, // 64 KB
    },
})
    .decorate("users", new Users())
    .ws("/ws", {
        body: ChatRequest,
        response: ChatResponse,

        beforeHandle() {
            if (!app.server) {
                return {
                    error: "app.server is undefined",
                };
            }
        },

        open(ws) {
            const userId = app.decorator.users.createUser(ws.id);

            ws.subscribe("chat");

            ws.send(
                JSON.stringify({
                    event: Event.USER_WELCOME,
                    userId,
                } satisfies typeof ChatEvent.static),
            );

            app.server?.publish(
                "chat",
                JSON.stringify({
                    event: Event.USER_JOIN,
                    users: app.decorator.users.getCount(),
                    userId,
                }),
            );

            console.log(userId, "joined");
        },

        close(ws, _code, _reason) {
            ws.unsubscribe("chat");

            const userId = app.decorator.users.removeUser(ws.id);

            app.server?.publish(
                "chat",
                JSON.stringify({
                    event: Event.USER_LEAVE,
                    users: app.decorator.users.getCount(),
                    userId,
                }),
            );

            console.log(userId, "left");
        },

        message(ws, message) {
            const userId = app.decorator.users.getUser(ws.id);

            if (!userId) {
                ws.send({ error: "no user connected to this websocket" });
                ws.close();
                return;
            }

            app.server?.publish(
                "chat",
                JSON.stringify({
                    event: Event.MESSAGE,
                    content: message,
                    userId,
                }),
            );
        },
    })
    .listen(8080);

console.log(`${app.server?.hostname}:${app.server?.port}`);
