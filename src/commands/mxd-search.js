const AssetsQuery = require('../proxies/assets-query.js');

module.exports = ({ heimdall }) => async ({ args, reply }) => {
  const query = (new AssetsQuery())
    .filter('search', args);
  const assets = await heimdall(query);
  if (assets.length) {
    const lines = assets.map(asset => `${asset.title} ${asset.url}`);
    lines.push(`<https://store.maxdome.de/suche?search=${args}|show all...>`);
    reply.text(lines.join('\n'));
  } else {
    reply.text(`no results found for "${args}"`);
  }
};
