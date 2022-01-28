import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app: any) {
  app.use(
    createProxyMiddleware('/api',
    {
      target: 'https://api.simbroadcasts.tv',
      changeOrigin: true,
      ws: true,
    })
  );

  app.use(
    createProxyMiddleware('/ws',
      {
        target: 'http://192.168.20.127:8440',
        changeOrigin: true,
        ws: true,
    })
  );
}