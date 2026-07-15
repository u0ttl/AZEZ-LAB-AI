FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema server/prisma/schema.prisma
EXPOSE 8787
CMD ["npm","run","server"]
