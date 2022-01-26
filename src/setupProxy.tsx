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
        target: 'http://73.213.79.81:8080',
        changeOrigin: true,
        ws: true,
    })
  );
}