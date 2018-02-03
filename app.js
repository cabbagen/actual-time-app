const express = require('express');
const app = express();
const { applicationInit, registeMiddleware } = require('./common/applicationInit.js');
const middlewares = require('./middleware/index.middleware.js');
const databaseInit = require('./database/index.js');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 初始化数据库
databaseInit();

// 模版引擎
app.set('views', './views');
app.set('view engine', 'pug');

// 静态文件
app.use('/static', express.static('public'));

// 加载中间件
registeMiddleware(app, middlewares);

// 加载 Controller 
try {
  applicationInit(app, true);
} catch(e) {
  console.log('请检查 Controller 文件');
  console.log(e);
}

// socket.io server ...
io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(4000, function() {
  console.log('hostname: localhost, port: 4000,  listen...');
});

