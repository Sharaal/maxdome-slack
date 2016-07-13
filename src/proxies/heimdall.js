'use strict';

const rp = require('request-promise');

module.exports = (apikey, appid, proxyOptions = {}) => {
  return {
    search: (term, searchOptions = {}) => {
      const options = Object.assign({}, proxyOptions.searchOptions || {}, searchOptions);
      const queries = [
        `apikey=${apikey}`,
        `appid=${appid}`,
        `filter[]=contentTypeSeriesOrMovies`,
        `filter[]=search~${term}`,
      ];
      if (options.pageSize) {
        queries.push(`pageSize=${options.pageSize}`);
      }
      return rp.get({
        url: `https://heimdall.maxdome.de/interfacemanager-2.1/mxd/assets?${queries.join('&')}`,
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
