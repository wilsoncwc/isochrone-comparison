# Isochrone Comparison
[![Build and Deploy](https://img.shields.io/github/deployments/wilsoncwc/isochrone-comparison/production?label=vercel&logo=vercel&logoColor=white)](https://github.com/wilsoncwc/isochrone-comparison/deployments/activity_log?environment=Production)
[![ESLint](https://github.com/wilsoncwc/isochrone-comparison/workflows/CI/badge.svg)](https://github.com/wilsoncwc/isochrone-comparison/workflows/lint.yml)

An application for comparing the output shapes of various isochrone services. 
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequistes
You will need to obtain the following API keys to run the complete application
 * [Mapbox API Key](https://docs.mapbox.com/help/getting-started/access-tokens/)
 * [TravelTime API Key and App ID](https://docs.traveltime.com/api/overview/getting-keys)
 * [OpenRouteService API Key](https://openrouteservice.org/dev/#/signup)

## Running locally
Enter the following into a new file called `.env.local` in the project root, replacing <access_token> with the respective key
```
NEXT_PUBLIC_MAPBOX_TOKEN=<access_token>
NEXT_PUBLIC_OPENROUTESERVICE_TOKEN=<access_token>
NEXT_PUBLIC_TRAVELTIME_APP_ID=<access_token>
NEXT_PUBLIC_TRAVELTIME_API_KEY=<access_token>
```

Then run the following:
```bash
yarn
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
The site is publically available on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) at https://isochrone-comparison.vercel.app/.
