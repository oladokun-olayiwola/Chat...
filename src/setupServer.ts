// import { Application, json, urlencoded, Response, Request, NextFunction } from "express"

import { json, urlencoded } from "express"
import cors from "cors"
import hpp from "hpp"
import helmet from "helmet"
import express from "express"
import cookieSession from "cookie-session"
import compression from "compression"






// export class ChattyServer {
//     private app: Application;

//     constructor(app:Application) {
//         this.app = app
//     }

//     public start(): void {};

//     private securityMiddleware(app: Application): void {};

//     private standardMiddleware(app: Application): void {};

//     private routesMiddleware(app:Application): void {};

//     private globalErrorHandler(app: Application): void {};
    
//     private startServer(app: Application): void {};

//     private createSocketIO(app: Application): void {};

//     private startHtppServer(app: Application): void {};

// }