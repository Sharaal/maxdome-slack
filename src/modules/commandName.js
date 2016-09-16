module.exports = ({ req }) => {
  return { commandName: req.body.command, args: req.body.text };
};
