This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel with GitHub Actions

The `.github/workflows/ci-cd.yml` workflow runs lint, tests, and a production build on pull requests and pushes to `main`. After those checks pass, it deploys pull requests as Vercel Preview deployments and pushes to `main` as Production deployments. Preview deployments are skipped for pull requests from forks because GitHub does not expose repository secrets to those workflows.

### One-time setup

1. Create or import this repository as a project in [Vercel](https://vercel.com/new), using the repository root as the project root.
2. Link the local repository to the Vercel project with `npx vercel link`. In the Vercel dashboard, make sure the project's Git integration will not also deploy the same commits automatically.
3. Add these repository secrets under **GitHub → Settings → Secrets and variables → Actions**:
   - `VERCEL_TOKEN`: a token created in your Vercel account settings.
   - `VERCEL_ORG_ID`: the `orgId` from `.vercel/project.json`.
   - `VERCEL_PROJECT_ID`: the `projectId` from `.vercel/project.json`.
4. Push to `main` to deploy to Production, or open a pull request from a branch in this repository to create a Preview deployment.

The `.vercel` directory is ignored by Git; do not commit its project file or your Vercel token.
