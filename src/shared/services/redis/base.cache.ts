import { createClient } from "redis";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
    client: RedisClient;
    log: Logger;

    constructor (cacheName: string) {
        this.client = createClient()
        this.log = createLogger(cacheName)
        this.cacheError();
    }

    private cacheError(): void {
        this.client.on("error", (err) => {
            this.log.error(err);
            });
    }
}