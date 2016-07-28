const pkg = require(process.cwd() + '/package.json');

module.exports = async ({ reply }) => {
  reply.text(`${pkg.name} v${pkg.version}`);
};
