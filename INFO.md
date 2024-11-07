
## Dev

```bash
pn run build:basin
```

```bash
pn dev:next
```

## Publish to NPM

update the version in /packages/core/package.json

```bash
pnpm publish packages/rainbowkit --access public --no-git-checks
```

## Installing dependencies

Installing dependencies with filter by name

```bash
pnpm add -D tailwindcss postcss autoprefixer --filter babylon-react
```

```bash
pnpm install -D tailwindcss postcss autoprefixer --filter example
```

## Troubleshooting

