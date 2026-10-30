# TECHGEAR PRO

A hardware importer landing page and interactive depot catalog built with React, TypeScript, Vite, and Tailwind CSS.

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run lint
npm run build
```

## Inventory

The catalog, category definitions, and `HardwareProduct` type are maintained in `src/data/inventory.ts`. Search matches product names, chipsets, SKUs, and listed specifications; category filters can be combined with search.

Product inquiries open WhatsApp with a product-specific message. Replace the generic `wa.me` share link in `src/App.tsx` with the depot's WhatsApp number when it is available.
