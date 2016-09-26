module.exports = ({ AssetsQuery, heimdall, hostname, pageSize }) => async ({ args, reply }) => {
  hostname = hostname || 'store.maxdome.de';
  const query = (new AssetsQuery())
    .filter('contentTypeSeriesOrMovies')
    .filter('search', args)
    .query('pageSize', pageSize);
  const assets = await heimdall.getAssets(query);
  if (assets.length) {
    const attachments = assets.map(asset => {
      return {
        title: reply.link(`https://${hostname}/${asset.id}`, asset.title),
        text: asset.description,
        actions: [{
          type: 'button',
          text: 'Merken',
          name: 'mxd-notepad-add',
          value: asset.id
        }]
      };
    });
    reply.send(
      reply.link(`https://${hostname}/suche?search=${encodeURIComponent(args)}`, 'show all...'),
      attachments
    );
  } else {
    reply.send(`no results found for "${args}"`);
  }
};
