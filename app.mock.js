const fs = require('fs');
const targetFilePath = './app.spec.js';
const appFile = fs.readFileSync('./app.js');

if (appFile) {
  const exportBuffer = Buffer.from('module.exports = app;', 'utf8');
  const completeAppFile = Buffer.concat([appFile, exportBuffer]);

  fs.writeFileSync(targetFilePath, completeAppFile);
} else {
  throw new Error('获取 app 文件失败');
}
