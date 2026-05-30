module.exports = {
  apps: [
    {
      name: 'vite-preview',
      script: 'npx',
      args: 'vite preview --port 5173 --host',
      cwd: __dirname,
      env: { NODE_ENV: 'production' }
    }
  ]
}
