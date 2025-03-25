import { createProxyMiddleware } from 'http-proxy-middleware'

export default function (req, res) {
  let target = ''

  if (req.url.startsWith('/api')) {
    target = 'https://api.xiaoyuzhoufm.com/api'
  }

  createProxyMiddleware({
    target,
    changeOrigin: true
  })(req, res)
}
