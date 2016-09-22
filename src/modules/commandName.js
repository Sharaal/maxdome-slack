module.exports = ({ req }) => {
  const body = req.body;
  if (body.actions && body.actions.length > 0) {
    const action = body.actions[0];
    return { commandName: action.name, args: action.value };
  }
  return { commandName: body.command, args: body.text };
};
