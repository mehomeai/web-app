# Me Home AI — Personal AI Showcase

This repository contains the Me Home AI showcase website, interactive product demo,
and supporting API and shared packages. Me Home AI is a privacy-first home agentic
system. Learn about the vision at [Me — Your intelligence. Yours.](https://mehomeai.replit.app/me/).

## Development

This is a pnpm workspace using Node.js 24 and TypeScript. Install dependencies with
`pnpm install`, then run `pnpm run typecheck` or `pnpm run build` from the repository
root. The showcase website and interactive demo live in `artifacts/me-website` and
`artifacts/me-demo`; supporting API and shared packages live in `artifacts/api-server`
and `lib/`.

The API requires `DATABASE_URL` to connect to PostgreSQL. See `replit.md` and the
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
