# Copilot Instructions

## Commands

All commands run from the monorepo root:

```bash
bun run api          # Start API dev server
bun run dev          # Alias: start API with --watch (bun run --watch src/infra/main.ts)
bun run test:api     # Run all unit tests
bun run test:e2e     # Run all E2E tests (requires Docker services)
bun run typecheck:api # TypeScript type-check (no emit)
bun run lint         # Biome lint
bun run lint:fix     # Biome lint with auto-fix
bun run format       # Biome format (write)
bun run check        # Biome check (lint + format)
bun run check:fix    # Biome check with auto-fix
```

Run a single test file:
```bash
bun run --cwd apps/api test -- path/to/file.spec.ts
```

Generate Prisma client (must use local binary — CLI v7 is incompatible with `@prisma/client@5`):
```bash
node node_modules/.bun/prisma@5.22.0/node_modules/prisma/build/index.js generate --schema apps/api/prisma/schema.prisma
```

Start local infrastructure (Postgres + Redis):
```bash
docker compose up -d
```

## Architecture

This is a **NestJS + Clean Architecture + DDD** monorepo (Bun workspaces). The only app currently is `apps/api`.

### Layer Dependency Rule

`infra/` → `domain/` → `core/` (dependencies point inward only)

### Source Layout (`apps/api/src/`)

```
core/          # Shared kernel — pure TS, zero framework deps
domain/        # Business rules, organized by bounded context
infra/         # NestJS, Prisma, Redis, HTTP controllers
```

**`core/`** contains base classes only — `Entity<Props>`, `AggregateRoot<Props>`, `ValueObject<Props>`, `WatchedList<T>`, `UniqueEntityId` (UUIDv7), the `Either<L, R>` monad, generic errors (`ResourceNotFoundError`, `NotAllowedError`), and `DomainEvents` static bus.

**`domain/{context}/`** follows a fixed two-sublayer layout:
- `enterprise/` — pure domain: entities, value objects, domain events
- `application/` — use cases, abstract repository contracts, abstract ports (cryptography, storage, etc.)

Current bounded contexts: `account`, `video`, `comment`, `playlist`, `watch-history`.

**`infra/`** is fully implemented and structured as:

```
infra/
  app.module.ts            # Root NestJS module
  main.ts                  # Bootstrap (port 3000)
  env/                     # EnvService wrapping @nestjs/config + Zod schema
  auth/                    # JwtStrategy, JwtAuthGuard, @CurrentUser(), @Public(), AuthModule
    user-payload.ts        # export type UserPayload = { sub: string }
  cryptography/            # BcryptHasher, JwtEncrypter, CryptographyModule
  storage/                 # R2Storage (Cloudflare R2 via @aws-sdk/client-s3), StorageModule
  cache/                   # CacheRepository (abstract), RedisCacheRepository, CacheModule
  database/
    prisma/
      prisma.service.ts
      repositories/        # 8 Prisma repo implementations
      mappers/             # 9 mappers (toDomain / toPrisma)
    database.module.ts
  http/
    pipes/zod-validation-pipe.ts
    presenters/            # 5 static Presenter classes
    controllers/           # 26 controllers (one file = one endpoint)
    http.module.ts
  events/                  # 10 domain event subscribers, EventsModule
```

### Three-Layer Repository Pattern

Every resource requiring persistence requires three implementations:

1. **Abstract contract** (`domain/{context}/application/repositories/`) — `abstract class`, typed with domain entities, zero deps.
2. **Prisma implementation** (`infra/database/prisma/repositories/`) — implements abstract class, uses `PrismaQuestionMapper.toDomain/toPrisma`, calls `DomainEvents.dispatchEventsForAggregate(entity.id)` after `create()` and `save()`.
3. **In-memory implementation** (`test/repositories/`) — exposes `public items: Entity[]`, mirrors the full contract, also dispatches domain events after mutations.

## Key Conventions

### Either Monad (no throws in the domain)
All use case `execute()` methods return `Promise<Either<ErrorType, ResponseType>>`. Entities and Value Objects also use `Either` in their `static create()` factory. **Never `throw` anywhere in `domain/` or `core/`.**

```ts
// Use case return pattern
return left(new ResourceNotFoundError())  // failure
return right({ video })                   // success

// Propagate entity/VO creation failures upward
const result = MyValueObject.create(raw)
if (result.isLeft()) return left(result.value)
```

### Use Case Structure
- Class: `@Injectable()` + constructor injection via abstract repositories
- Request/response: local `type` declarations (not `interface`)
- Authorization: fetch resource → compare IDs → `left(new NotAllowedError())` if mismatch
- Domain errors: implement `UseCaseError`, live in `use-cases/errors/`, messages centralized in a shared `enum`/`const`

### Controller Structure
- One file = one endpoint; `handle()` calls exactly one use case
- Zod schema defined locally in the controller file; pipe applied per-parameter (`@Body(pipe)`)
- Unwrap `Either` explicitly — `switch (error.constructor)` to map to NestJS HTTP exceptions
- Serialize via static Presenter classes; never return raw domain objects
- All routes authenticated by default (global `JwtAuthGuard`); use `@Public()` to opt out
- Use `@CurrentUser()` decorator; `user.sub` is the `userId`

### Entity / Value Object Conventions
- Entities extend `Entity<Props>` (or `AggregateRoot<Props>` if they emit events)
- Value objects extend `ValueObject<Props>` — immutable, identity by value
- `UniqueEntityId` wraps UUIDv7
- Aggregate state changes (e.g., `publish()`, `delete()`) are methods on the entity; domain events are added via `this.addDomainEvent(new XxxEvent(this))`
- Setting a title auto-regenerates the slug; `touch()` updates `updatedAt`

### WatchedList
Used for child collection diffing (e.g., tags). Exposes `getNewItems()` and `getRemovedItems()` so repositories can perform minimal database writes.

### Naming

| Artifact | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `publish-video.ts` |
| Use Cases | `{VerbResource}UseCase` | `PublishVideoUseCase` |
| Controllers | `{VerbResource}Controller` | `PublishVideoController` |
| Prisma repos | `Prisma{Resource}sRepository` | `PrismaVideosRepository` |
| In-memory repos | `InMemory{Resource}sRepository` | `InMemoryVideosRepository` |
| Mappers | `Prisma{Resource}Mapper` | `PrismaVideoMapper` |
| Presenters | `{Resource}Presenter` | `VideoPresenter` |
| Domain Events | `{Resource}{EventName}Event` | `VideoPublishedEvent` |
| Event Subscribers | `On{EventName}` | `OnVideoPublished` |
| Unit test factories | `make{Resource}()` | `makeVideo()` |
| E2E test factories | `{Resource}Factory` class | `VideoFactory` |

### Testing

- **Unit tests** (`.spec.ts`) live colocated with the source file they test
- **E2E tests** (`.e2e-spec.ts`) live colocated with controllers in `infra/http/controllers/`
- Name the system under test `sut`; use `beforeEach` to reinitialize
- `it()` names start with `"should be able to ..."` or `"should not be able to ..."`
- Use `assert(result.isRight())` (not `if`) to narrow Either types before accessing `.value`
- Vitest globals are enabled — no need to import `describe`, `it`, `expect`, `vi`, `beforeEach`, etc.
- Path aliases: `@/` → `src/`, `test/` → `test/`
- Unit tests instantiate everything with `new` — never use NestJS IoC
- E2E tests use `Test.createTestingModule({ imports: [AppModule, DatabaseModule] })` + injected `{Resource}Factory` classes

### Tooling
- **Runtime**: Bun
- **Linter/Formatter**: Biome (`biome check --write .` for all-in-one fix)
- **Style**: 2-space indent, 100-char line width, single quotes, no semicolons, trailing commas, LF line endings
- `useImportType` rule is **off** in Biome — `import type` is NOT required for Biome linting
- **However**: Bun strips TypeScript types at runtime. Any `export type Foo` has no runtime binding. All files that import it MUST use `import type { Foo }` or Bun will crash with _"Export named 'Foo' not found"_.
- **Test runner**: Vitest (`globals: true`, `clearMocks: true`)
- **E2E Vitest config**: `vitest.config.e2e.mts` (must be `.mts` not `.ts` — `.ts` is treated as CJS by esbuild and breaks ESM-only packages). Must include `unplugin-swc` with `decoratorMetadata: true` so NestJS DI can resolve constructor parameters.
- **`@nestjs/testing` version must match `@nestjs/core`** major version — mismatched versions silently break DI resolution.

## Infrastructure / Docker

A `docker-compose.yml` at the repo root starts all required services:
```bash
docker compose up -d   # Postgres (port 5432) + Redis (port 6379)
```

Environment files:
- `apps/api/.env` — local dev (git-ignored); see `apps/api/.env.example` for required vars
- `apps/api/.env.test` — used by `bun run test:e2e` via `dotenv-cli`

Required env vars: `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDFLARE_ACCOUNT_ID`, `AWS_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## Domain Implementation Details

Key gotchas discovered when implementing the infra layer:

- **`Duration` VO**: use `.seconds` property (not `.value`) — e.g., `video.duration?.seconds ?? null` in mappers
- **`Slug`**: `Slug.create(str)` for DB restore (already-slugified string); `Slug.createFromText(str)` for human-readable text input
- **`VideoStatus`**: `VideoStatus.create(raw.status as VideoStatusEnum)` in mappers — there is no `.fromValue()` method
- **`BcryptHasher`**: implements both `HashGenerator` and `HashComparer`; `CryptographyModule` binds both tokens with `useExisting: BcryptHasher`
- **`RegisterUserUseCase`**: expects `passwordHash` (pre-hashed string), not the raw password — the controller must inject `HashGenerator` and hash before calling the use case
- **Real domain error names**: `VideoAlreadyLikedError` (not `AlreadyLikedVideoError`); `UnlikeVideoUseCase` only returns `ResourceNotFoundError` (no `NotAllowedError`)
- **Event subscribers**: `DomainEvents.register()` signature is `(event: DomainEvent) => void`; cast to concrete type inside: `DomainEvents.register((event) => this.handle(event as ConcreteEvent), EventClass.name)`
- **`Either<never, T>` controllers**: if a use case returns `Either<never, T>`, the `isLeft()` branch is unreachable — remove it to avoid TypeScript error on `result.value` type inference

## Abstract Ports Location

Cryptography and storage abstract ports live in the domain layer (not infra):
- `src/domain/account/application/cryptography/hash-generator.ts`
- `src/domain/account/application/cryptography/hash-comparer.ts`
- `src/domain/account/application/cryptography/encrypter.ts`
- `src/domain/video/application/storage/uploader.ts`

Test fakes:
- `test/cryptography/fake-hasher.ts` — implements both `HashGenerator` and `HashComparer`
- `test/cryptography/fake-encrypter.ts` — implements `Encrypter`

## Specialized Agents

For complex tasks in this repo, prefer delegating to these agents in `.github/agents/`:

- **Architecture Expert** — layer placement, dependency direction, bounded context layout
- **Controller Expert** — NestJS HTTP controllers, Zod pipes, Either unwrapping, presenters
- **Use Case Expert** — use case `execute()`, Either monad, domain error mapping, authorization
- **Repository Expert** — abstract contracts, Prisma implementation, mappers, WatchedList, cache
- **Test Expert** — unit/E2E tests, in-memory repos, factory pattern, domain event testing
