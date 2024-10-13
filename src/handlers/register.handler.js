import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect } from './helper.js';
import { handleEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {

    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });
    
    // 접속시 유저 정보 생성 이벤트 처리
    handleConnection(socket, userUUID);

     // 메세지를 data 란 이름으로 handlerEvent 함수로 전달합니다.
    socket.on('event', (data) => handleEvent(io, socket, data));

    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
