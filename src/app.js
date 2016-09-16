const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const { AssetsQuery, Heimdall } = require('mxd-heimdall');
const heimdall = new Heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});
const commands = {
  '/mxd-info': require('info-command').commands.info,
  '/mxd-search': require('mxd-search-command').commands['mxd-search']({
    AssetsQuery: AssetsQuery,
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

app.post('/webhook', async (req, res) => {
  const reply = require('./modules/reply.js')({ res });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ req });
    if (!commands[commandName]) {
      throw new Error(`unknown command "${commandName}"`);
    }
    await commands[commandName]({ args, reply });
  } catch(e) {
    reply.send(`error "${e.message}"`);
  }
});

app.listen(process.env.PORT);
