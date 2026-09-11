# syntax=docker/dockerfile:1

# ============================================
# PocketBase v0.35.0 – pinned release
# PocketBase publishes no official Docker image;
# this downloads the exact binary used by the forge CLI.
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
# Runtime – tiny alpine with just the binary
# ============================================
FROM alpine:3.20

RUN apk add --no-cache curl ca-certificates

COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

COPY docker/pocketbase/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8090

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -f http://localhost:8090/api/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
