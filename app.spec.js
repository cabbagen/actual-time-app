const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const app = express();
const application = require('./common/applicationInit.js');

mongoose.connect('mongodb://localhost/actualTime', { useMongoClient: true });

mongoose.Promise = bluebird;
const db = mongoose.connection;

db.on('error', function() {
  console.log('connect error');
});
db.on('open', function() {
  console.log('connect ok');
});


// 模版引擎
app.set('views', './views');
app.set('view engine', 'jade');

// 静态文件
app.use('/static', express.static('public'));

// 加载 Controller 
try {
  application.applicationInit(app, true);
} catch(e) {
  console.log('请检查 Controller 文件');
  console.log(e);
}

app.listen(4000, function() {
  console.log('hostname: localhost, port: 4000,  listen...');
});

module.exports = app;