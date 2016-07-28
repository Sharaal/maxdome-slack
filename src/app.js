const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const heimdall = require('./proxies/heimdall.js')({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID,
  pageSize: process.env.HEIMDALL_PAGESIZE || 3
});
const commands = {
  '/mxd-info': require('./commands/mxd-info.js'),
  '/mxd-search': require('./commands/mxd-search.js')({ heimdall })
};

app.post('/api', async (req, res) => {
  const command = commands[req.body.command];
  const reply = {
    link: (url, label) => {
      if (label) {
        return `<${url}|${label}>`;
      }
      return url;
    },
    send: text => {
      if (Array.isArray(text)) {
        text = text.join('\n');
      }
      res.send({ response_type: 'in_channel', text });
    }
  };
  if (!command) {
    reply.send(`unknown command "${req.body.command}"`);
    return;
  }
  try {
    await command({ args: req.body.text, reply });
  } catch(e) {
    reply.send(`error: "${e.message}"`);
  }
});

app.listen(process.env.PORT);
