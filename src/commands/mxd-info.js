const pkg = require(process.cwd() + '/package.json');

module.exports = async ({ reply }) => {
  reply.text(`<${pkg.homepage}|${pkg.name}> v${pkg.version}`);
};
