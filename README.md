# janitor

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Install dependencies:

```bash
bun install
```

Install crontab (only tested on MacOS):

```bash
bun setup  # will create a config.ts file if it does not exist
```

See configuration options in `config.example.ts`.
`janitor` will read from `config.ts`, so if you want to customize things you can make changes there and re-run the setup command.
