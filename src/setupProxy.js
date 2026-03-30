const { createProxyMiddleware } = require('http-proxy-middleware');

const blogTarget = 'http://127.0.0.1:4321';

module.exports = function setupProxy(app) {
  app.use(
    createProxyMiddleware({
      target: blogTarget,
      changeOrigin: true,
      ws: true,
      pathFilter: '/blogs',
      logLevel: 'warn',
    })
  );
};
