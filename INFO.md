
## Dev

```bash
pn run build:basin
```

```bash
pn dev
```

## Publish to NPM

update the version in /packages/core/package.json

```bash
pnpm publish packages/rainbowkit --access public --no-git-checks
```

## Installing dependencies

Installing dependencies with filter by name

```bash
pnpm add @babylonlabs-io/btc-staking-ts bitcoinjs-lib --filter babylon-react
```

```bash
pnpm install react-responsive-modal tailwind-merge react-icons react-tooltip --filter example
```

## Troubleshooting

