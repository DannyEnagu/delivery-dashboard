# Delivery Tracking Dashboard with Map Integration

Keep track of ongoing package delivery just by searching the tracking number.

## Challenge

Build a delivery tracking dashboard with the following features:

- Input a tracking number to fetch shipment details from a mock API.
- Display a map (using Google Maps, Leaflet, or Mapbox) showing the current location of the package and its route history.
- Add a status timeline showing key milestones (e.g., “Shipped,” “In Transit,” “Out for Delivery”).
- Automatically refresh the delivery status and location every 30 seconds using WebSocket.
- Allow users to zoom into specific route points on the map.
- Add animations for map markers when the location updates.
- Use TypeScript for better type safety.

## Tools

- Vue.js/Nuxt.js
- Pinia
- PrimeVue
- PrimeFlex
- PrimeIcons

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Example

Type the numbers bellow on the search bar

- 12345
- 67890
