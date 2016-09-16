module.exports = ({ req }) => async () => new Promise((resolve, reject) => {
  const account = { id: req.body.user_id };
  resolve(account);
});
