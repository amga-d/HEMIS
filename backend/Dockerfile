FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


COPY . .

# Generate Prisma client
RUN npx prisma generate

# Stage 2
FROM node:22-alpine 

ENV NODE_ENV=production

COPY --from=builder /app /app

WORKDIR /app 

EXPOSE 5000

CMD ["npm", "start"]
