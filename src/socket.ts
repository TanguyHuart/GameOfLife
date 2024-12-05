"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000", {transports : ["websocket"]});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});
