module.exports = ({ AssetsQuery, heimdall, hostname, pageSize }) => async ({ args, reply }) => {
  hostname = hostname || 'store.maxdome.de';
  const query = (new AssetsQuery())
    .filter('contentTypeSeriesOrMovies')
    .filter('search', args)
    .query('pageSize', pageSize);
  const assets = await heimdall.getAssets(query);
  if (assets.length) {
    const attachements = assets.map(asset => {
      return {
        title: reply.link(`https://${hostname}/${asset.id}`, asset.title),
        text: asset.description,
        actions: [{
          text: 'Merken',
          name: 'mxd-notepad-add',
          value: asset.id
        }]
      };
    });
    reply.send(
      `results found, ${reply.link(`https://${hostname}/suche?search=${encodeURIComponent(args)}`, 'show all...')}`,
      attachements
    );
  } else {
    reply.send(`no results found for "${args}"`);
  }
};
