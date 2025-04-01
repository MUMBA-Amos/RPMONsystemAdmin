This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

# publish docker
 - doctl registry login
 - docker build -t baame-admin:latest .
 - docker tag baame-admin registry.digitalocean.com/baame/baame-admin
 - docker push registry.digitalocean.com/baame/baame-admin
