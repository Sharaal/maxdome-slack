module.exports = ({ req }) => async () => new Promise(resolve => {
  const account = { id: `${req.body.team_id}:${req.body.user_id}` };
  resolve(account);
});
