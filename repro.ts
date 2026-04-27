import { IncomingMessage, ServerResponse } from "node:http";
import { PassThrough } from "node:stream";
import { sendNodeResponse } from "./src/adapters/node.ts";

const socket = new PassThrough();
const req = new IncomingMessage(socket as any);
const res = new ServerResponse(req);
(res as any).assignSocket(socket);

// trigger writeHead slow path
res.setHeader("x-existing-foo", "bar");

const webRes = new Response("ok\n", {
  status: 200,
  statusText: "OK",
  headers: [
    ["x-bar", "bar"]
  ],
});

// This directly calls srvx's current implementation.
// Buggy srvx@0.11.15 on Deno v2.7.13 throws:
// TypeError: The "name" argument must be of type string. Received an instance of Array
await sendNodeResponse(res, webRes);
