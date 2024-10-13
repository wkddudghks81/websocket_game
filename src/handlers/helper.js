import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
}; 

export const handleConnection = (socket, UUID) => {
console.log(`New user connected: ${UUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());
  createStage(UUID);


  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
  socket.emit('connection', { uuid: UUID });
};

export const handleEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
      socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
      return;
    }
  
    const handler = handlerMappings[data.handlerId];
    if (!handler) {
      socket.emit('response', { status: 'fail', message: 'Handler not found' });
      return;
    }
  
    // 적절한 핸들러에 userID 와 payload를 전달하고 결과를 받습니다.
    const response = handler(data.userId, data.payload);
    // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
    if (response.broadcast) {
      io.emit('response', 'broadcast');
      return;
    }
    // 해당 유저에게 적절한 response를 전달합니다.
    socket.emit('response', response);
  };