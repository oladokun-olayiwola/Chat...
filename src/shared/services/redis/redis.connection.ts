import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { BaseCache } from "@services/redis/base.cache";

const log: Logger = createLogger("redisConnection")

class RedisConnection extends BaseCache {
    constructor() {
        super("redisConnection")
    }

    async connect(): Promise<void> {
        await this.client.connect()
        const res = await this.client.ping()
        log.info(res);
    } catch (error: any) {
        log.error("redis error", error)
    }
}

export const redisConnection: RedisConnection = new RedisConnection()