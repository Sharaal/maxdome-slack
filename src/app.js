'use strict';

const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const heimdall = require('./proxies/heimdall.js')(process.env.HEIMDALL_APIKEY, process.env.HEIMDALL_APPID);

app.post('/api', (req, res) => {
  heimdall
    .search(req.body.text)
    .then(assets => {
      if (assets.length) {
        res.send(assets.join(', '));
      } else {
        res.send(`no results found for "${req.body.text}"`);
      }
    });
});

app.listen(process.env.PORT);
