// Dummy entrypoint to satisfy Vercel - real site is index.html
module.exports = (req, res) => {
  res.writeHead(302, { Location: '/index.html' });
  res.end();
};
