import express from "express";
import bootstrap from "./src/app.server.js";
import { Server } from "socket.io";
import { runSoket } from "./src/Modules/SocketIo/index.js";

const app = express();
const port = process.env.PORT || 5000;

await bootstrap(app, express);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

runSoket(server);