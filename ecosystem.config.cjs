// PM2 process definition for the EC2 deployment.
// Runs `next start` and reads env from the server-managed .env.production file.
module.exports = {
  apps: [
    {
      name: "pulse",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
