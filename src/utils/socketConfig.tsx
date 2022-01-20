import { w3cwebsocket as WebSocketClient } from "websocket";
let SOCKET_ADDRESS = 'ws://127.0.0.127:8000'
const socket = new WebSocketClient(SOCKET_ADDRESS, 'echo-protocol');
/*
import { client as WebSocketClient } from "websocket";

const socket = new WebSocketClient();

socket.connect('ws://127.0.0.1:8000', 'echo-protocol');
*/
export default socket;

/*
import openSocket from 'socket.io-client';

const socket = openSocket("ws://127.0.0.1:8000");

export default socket;
*/