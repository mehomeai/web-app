# Me Home AI — Demo-first product

Me Home AI is a privacy-first home agentic system. This is its first product release:
a public product website and an interactive demo that shows the intended experience.
The demo is a product showcase, not a production home-control application.
Learn about the vision at [Me — Your intelligence. Yours.](https://mehomeai.replit.app/me/).

## Development

This is a pnpm workspace using Node.js 24 and TypeScript. Install dependencies with
`pnpm install`, then run `pnpm run typecheck` or `pnpm run build` from the repository
root (the build command expects `PORT` and `BASE_PATH`). Run the website with
`PORT=5000 BASE_PATH=/ pnpm --filter @workspace/web dev` and the interactive demo
with `PORT=5001 BASE_PATH=/ pnpm --filter @workspace/demo dev`.

## Repository layout

- `apps/web` — public product website and waitlist experience.
- `apps/demo` — interactive, video-based product demo.
- `packages/api-server` — API used by the website waitlist.
- `packages/api-client-react`, `packages/api-spec`, `packages/api-zod`, `packages/db` —
  shared API contracts, generated clients/validators, and database schema.
- `tools/mockup-sandbox` — development-only mockup preview tool, not part of the product.
- `scripts` — workspace utilities.

The waitlist API requires `DATABASE_URL` to connect to PostgreSQL. See `replit.md` and the
workspace package scripts for additional development commands.

## Contributing

Start with the [contribution guide](https://github.com/mehomeai/.github/blob/main/CONTRIBUTING.md),
[code of conduct](https://github.com/mehomeai/.github/blob/main/CODE_OF_CONDUCT.md), and
[governance](https://github.com/mehomeai/.github/blob/main/GOVERNANCE.md).
Discuss substantial changes in an issue before implementing them. Pull requests
should include relevant tests and documentation.

For questions and cross-project planning, use [community discussions](https://github.com/mehomeai/.github/discussions).
Report vulnerabilities privately through this repository's **Security → Report a vulnerability**;
see the [security policy](https://github.com/mehomeai/.github/blob/main/SECURITY.md).

## License

[Apache License 2.0](LICENSE). Third-party code, model weights, and datasets may
have their own terms and must be reviewed before inclusion.
