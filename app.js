const express = require('express');
require('express-async-errors');

const path = require('path');
const app = express();
const { applicationInit, registeMiddleware } = require('./kernel/core.js');
const middlewares = require('./middleware/index.middleware.js');
const loggerProvider = require('./providers/log.provider.js');
const databaseInit = require('./database/index.js');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// chat socket service
const { SocketChatService } = require('./micro-services/chat/chat.socket');
SocketChatService.init(io);

// 初始化日志服务
loggerProvider.initLogger(path.resolve(__dirname, './log.config.json'));

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

http.listen(4000, function() {
  console.log('hostname: localhost, port: 4000,  listen...');
});

