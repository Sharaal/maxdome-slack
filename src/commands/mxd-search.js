module.exports = ({ heimdall }) => async ({ args, reply }) => {
  const assets = await heimdall.search(args);
  if (assets.length) {
    reply.text(assets.join(', '));
  } else {
    reply.text(`no results found for "${args}"`);
  }
};
