FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml .npmrc pnpm.json pnpm-workspace.yaml ./
RUN pnpm install
COPY . .
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN pnpm prisma:generate
EXPOSE 4000
CMD ["pnpm", "dev"]
