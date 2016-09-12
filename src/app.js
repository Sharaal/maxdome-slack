const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const Heimdall = require('mxd-heimdall').Heimdall;
const heimdall = new Heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});
const commands = {
  '/mxd-info': require('info-command'),
  '/mxd-search': require('mxd-search-command')({
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

app.post('/webhook', async (req, res) => {
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
