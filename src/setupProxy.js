const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/fineract-provider',
        createProxyMiddleware({
            target: 'https://foursmiles.mifosconnect.com',
            changeOrigin: true,
        })
    );
};
