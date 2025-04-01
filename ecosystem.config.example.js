module.exports = {
  apps: [
    {
      name: "dev-rpmon-admin(port:3651)",
      script: "yarn --name 'nextjs' --interpreter bash -- start -p 3651",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
