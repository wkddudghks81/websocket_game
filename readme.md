라이브러리 설치
npm init -y
npm install express socket.io
npm install -D nodemon

"scripts": {
    "dev": "nodemon src/app.js"	//원래있던 test 지우고
  },

실행 npm run dev