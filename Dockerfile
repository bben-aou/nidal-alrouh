FROM node:20
WORKDIR /app

COPY . .

RUN corepack enable \
  && corepack prepare yarn@1.22.22 --activate \
  && yarn install --frozen-lockfile \
  && yarn workspace @nidal-alrouh/backend run prisma:generate \
  && yarn workspace @nidal-alrouh/backend build

CMD ["node", "apps/backend/dist/main.js"]

