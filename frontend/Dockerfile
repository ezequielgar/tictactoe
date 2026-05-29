FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml .npmrc pnpm.json pnpm-workspace.yaml ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--host"]
