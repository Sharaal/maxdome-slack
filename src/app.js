'use strict';

const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const heimdall = require('./proxies/heimdall.js')({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID,
  proxyOptions: {
    searchOptions: { pageSize: process.env.HEIMDALL_PROXYOPTIONS_SEARCHOPTIONS_PAGESIZE || 3 }
  }
});
const commands = {
  '/mxd-search': require('./commands/mxd-search.js')({ heimdall })
};

app.post('/api', async (req, res) => {
  const command = commands[req.body.command];
  const reply = {
    text: text => { res.send({ response_type: 'in_channel', text }); }
  };
  if (!command) {
    reply.text(`unknown command "${req.body.command}"`);
    return;
  }
  command({ args: req.body.text, reply });
});

app.listen(process.env.PORT);
