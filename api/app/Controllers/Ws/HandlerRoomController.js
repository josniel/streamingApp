'use strict'
const Ws = use('Ws')


class HandlerRoomController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
  }


  async onEmitstream (message) {
    console.log('emitmessage :>> ', message);
    if (message.isNewStream === true) {
      await this.socket.broadcast('stream', {
        root: message.root,
        isActive: true
      })
    }

  }
  async onError (error) {
    console.log('error :>> ', error);
  }
}

module.exports = HandlerRoomController
