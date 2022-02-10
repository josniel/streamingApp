'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/
/* const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const Ws = use('Ws')

io.on('connection', function (socket) {
  console.log(socket.id)
}) */
const Ws = use('Ws')

Ws.channel('room:*', 'HandlerRoomController').middleware([])
/* const Ws = use('Ws')

Ws.channel('consultation:*', 'HandlerChatController').middleware([]) */

/* Ws.channel('consultation:*', ({ socket }) => {
  console.log('user joined with', socket.topic)
}) *//* .middleware(['auth']) */
