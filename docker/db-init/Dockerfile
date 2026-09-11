# syntax=docker/dockerfile:1

# ============================================
# PocketBase binary (pinned) for db-init
# ============================================
FROM alpine:3.20 AS pocketbase

ARG PB_VERSION=0.35.0
ARG TARGETARCH

RUN apk add --no-cache curl unzip \
    && case "$TARGETARCH" in \
         amd64) ARCH=amd64 ;; \
         arm64) ARCH=arm64 ;; \
         *) echo "Unsupported arch: $TARGETARCH" && exit 1 ;; \
       esac \
    && curl -fsSL \
       "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip" \
       -o /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /usr/local/bin \
    && rm /tmp/pb.zip \
    && chmod +x /usr/local/bin/pocketbase

# ============================================
# Builder – install all deps, build workspace packages
# ============================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc .pnpmfile.cjs ./
COPY apps/api/package.json              apps/api/package.json
COPY apps/web/package.json              apps/web/package.json
COPY packages/configs/package.json      packages/configs/package.json
COPY packages/log/package.json          packages/log/package.json
COPY packages/pocketbase/package.json   packages/pocketbase/package.json
COPY packages/server-utils/package.json packages/server-utils/package.json
COPY packages/api/package.json          packages/api/package.json
COPY packages/federation/package.json   packages/federation/package.json
COPY packages/localization/package.json packages/localization/package.json
COPY packages/ui/package.json           packages/ui/package.json
COPY tools/package.json                 tools/package.json
COPY docs/package.json                  docs/package.json
COPY modules/package.json               modules/package.json
COPY modules/lifeforge--notes/package.json           modules/lifeforge--notes/package.json
COPY modules/lifeforge--squad-backlog/package.json modules/lifeforge--squad-backlog/package.json
COPY modules/lifeforge--todo-list/package.json      modules/lifeforge--todo-list/package.json
COPY locales/lang-en/package.json                   locales/lang-en/package.json

# Install deps only (skip postinstall build – source not copied yet)
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Build workspace packages that forge CLI needs at runtime
# configs must be built first (other packages import from @lifeforge/configs/vite)
RUN pnpm turbo build --filter=@lifeforge/configs && \
    pnpm turbo build --filter=@lifeforge/log --filter=@lifeforge/pocketbase --filter=@lifeforge/server-utils

# ============================================
# Runtime – Node with forge source, tsx, and PocketBase binary
# ============================================
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

# PocketBase binary from pinned release
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

WORKDIR /app

# Copy forge CLI source (dynamically imports .ts schema files at runtime via tsx)
COPY --from=builder /app/tools/src ./tools/src
COPY --from=builder /app/tools/tsconfig.json ./tools/tsconfig.json

# Copy root package.json (has the "forge" script: tsx tools/src/index.ts)
COPY --from=builder /app/package.json ./package.json

# Copy node_modules from builder (includes tsx, pocketbase SDK, and all deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy .npmrc
COPY .npmrc ./

# Copy built workspace packages (needed by forge CLI imports)
COPY --from=builder /app/packages/configs/dist      ./packages/configs/dist
COPY --from=builder /app/packages/configs/package.json ./packages/configs/package.json
COPY --from=builder /app/packages/log/dist          ./packages/log/dist
COPY --from=builder /app/packages/log/package.json  ./packages/log/package.json
COPY --from=builder /app/packages/pocketbase/dist   ./packages/pocketbase/dist
COPY --from=builder /app/packages/pocketbase/package.json ./packages/pocketbase/package.json
COPY --from=builder /app/packages/server-utils/dist ./packages/server-utils/dist
COPY --from=builder /app/packages/server-utils/package.json ./packages/server-utils/package.json

# Copy schema source files (imported dynamically by forge CLI)
COPY --from=builder /app/apps/api/src   ./apps/api/src
COPY --from=builder /app/modules/       ./modules/

ENV DOCKER_MODE=true
ENV PB_BINARY_PATH=/usr/local/bin/pocketbase
# PB_DIR is set in docker-compose.yaml to match the volume mount

COPY docker/db-init/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
