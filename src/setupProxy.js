const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/fineract-provider',
        createProxyMiddleware({
            target: 'https://test.meysa.co.ke',
            changeOrigin: true,
        })
    );
};
