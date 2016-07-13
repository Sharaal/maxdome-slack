const rp = require('request-promise');

const AssetsQuery = require('./assets-query.js');

module.exports = ({ apikey, appid, proxyOptions = {} }) => {
  return {
    search: (term, searchOptions = {}) => {
      const options = Object.assign({}, proxyOptions.searchOptions || {}, searchOptions);
      const query = (new AssetsQuery())
        .query('apikey', apikey)
        .query('appid', appid)
        .filter('contentTypeSeriesOrMovies')
        .filter('search', term);
      if (options.pageSize) {
        query.query('pageSize', options.pageSize);
      }
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
    }
  }
};
