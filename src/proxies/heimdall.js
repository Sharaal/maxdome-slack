const rp = require('request-promise');

const AssetsQuery = require('./assets-query.js');

module.exports = ({ apikey, appid, proxyOptions = {} }) => {
  return {
    query(options) {
      const query = (new AssetsQuery())
        .query('apikey', apikey)
        .query('appid', appid)
        .filter('contentTypeSeriesOrMovies');
      if (options.pageSize) {
        query.query('pageSize', options.pageSize);
      }
      return query;
    },
    assets(query) {
      return rp.get({
        url: `https://heimdall.maxdome.de/interfacemanager-2.1/mxd/assets?${query}`,
        headers: {
          accept: 'application/json',
          clienttype: 'Webportal',
          'maxdome-origin': 'de'
        },
        json: true,
        transform: data => data.assetList.map(asset => `${asset.title} http://store.maxdome.de/${asset.id}`)
      });
    },
    search(term, searchOptions = {}) {
      const options = Object.assign({}, proxyOptions.searchOptions || {}, searchOptions);
      const query = this.query(options)
        .filter('search', term);
      return this.assets(query);
    }
  }
};
