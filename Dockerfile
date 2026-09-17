# Stage 1: Build React Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Go Backend Binary
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Copy compiled frontend from Stage 1 into client/dist
COPY --from=frontend-builder /app/client/dist ./client/dist
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o water-sentinel main.go

# Stage 3: Minimal Production Image
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=backend-builder /app/water-sentinel /app/water-sentinel
COPY --from=frontend-builder /app/client/dist /app/client/dist

ENV PORT=8080
ENV DB_PATH=/app/water_sentinel.db
EXPOSE 8080

CMD ["/app/water-sentinel"]
