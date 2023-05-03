import bunyan from "bunyan";

export const log = bunyan.createLogger({ name: "my app", level: "debug" });
