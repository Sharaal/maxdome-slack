module.exports = ({ heimdall }) => async ({ args, reply }) => {
  const lines = await heimdall.search(args);
  if (lines.length) {
    lines.push(`<https://store.maxdome.de/suche?search=${args}|show all...>`);
    reply.text(lines.join('\n'));
  } else {
    reply.text(`no results found for "${args}"`);
  }
};
