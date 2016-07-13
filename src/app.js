'use strict';

const app = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

const proxyOptions = {
  searchOptions: { pageSize: process.env.HEIMDALL_PROXYOPTIONS_SEARCHOPTIONS_PAGESIZE || 3 }
}
const heimdall = require('./proxies/heimdall.js')(process.env.HEIMDALL_APIKEY, process.env.HEIMDALL_APPID, proxyOptions);

app.post('/api', (req, res) => {
  heimdall
    .search(req.body.text)
    .then(assets => {
      if (assets.length) {
        res.send({
          response_type: 'in_channel',
          text: assets.join(', ')
        });
      } else {
        res.send({
          response_type: 'in_channel',
          text: `no results found for "${req.body.text}"`
        });
      }
    });
});

app.listen(process.env.PORT);
