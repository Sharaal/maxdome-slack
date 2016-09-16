const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const { AssetsQuery, Heimdall } = require('mxd-heimdall');
const heimdall = new Heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});

const client = require('redis').createClient(process.env.REDIS_URL);
const sessionStorage = require('mxd-session-storage')({ client });

const mxdAuthCommands = require('mxd-auth-commands');
const mxdNotepadCommands = require('mxd-notepad-commands');

const commands = {
  '/mxd-info': require('info-command').commands.info,
  '/mxd-login': mxdAuthCommands.commands['mxd-login']({ heimdall, sessionStorage }),
  '/mxd-logout': mxdAuthCommands.commands['mxd-logout']({ heimdall, sessionStorage }),
  '/mxd-notepad-add': mxdNotepadCommands.commands['mxd-notepad-add']({ heimdall }),
  '/mxd-notepad-remove': mxdNotepadCommands.commands['mxd-notepad-remove']({ heimdall }),
  '/mxd-search': require('mxd-search-command').commands['mxd-search']({
    AssetsQuery: AssetsQuery,
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

app.post('/webhook', async (req, res) => {
  const loggedin = require('./modules/loggedin.js')({ req });
  const reply = require('./modules/reply.js')({ res });
  const heimdallLoggedin = mxdAuthCommands.modules['heimdall-loggedin']({ sessionStorage })({ loggedin, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ req });
    if (!commands[commandName]) {
      throw new Error(`unknown command "${commandName}"`);
    }
    await commands[commandName]({ args, heimdallLoggedin, loggedin, reply });
  } catch(e) {
    reply.send(`error "${e.message}"`);
  }
});

app.listen(process.env.PORT);
