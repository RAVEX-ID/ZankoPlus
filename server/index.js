'use strict';

console.log(`[boot] Node ${process.version}`);

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`زانکۆپلەس is running on http://localhost:${config.port}`);
});
