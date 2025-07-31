import { t } from "elysia";

export enum Event {
    USER_JOIN = "join",
    USER_LEAVE = "leave",
    MESSAGE = "msg",
    USER_WELCOME = "welcome",
}

export const SchemaChatRequest = t.String({ minLength: 1, maxLength: 1024 });

export const SchemaChatError = t.Object({
    error: t.String(),
});

export const SchemaChatEvent = t.Intersect([
    t.Record(t.String(), t.Any()),
    t.Object({
        event: t.Enum(Event),
        userId: t.Integer({ minimum: 1 }),
    }),
]);

export const SchemaChatResponse = t.Union([SchemaChatEvent, SchemaChatError, t.String({ maxLength: 16384 })]);

export type ChatEvent = typeof SchemaChatEvent.static
