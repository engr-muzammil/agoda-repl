from node:alpine as development

workdir /usr/src/app

copy package.json ./
copy pnpm-lock.yaml ./

run npm install -g pnpm

run pnpm install 

copy . .

run pnpm run build

from node:alpine as production

arg NODE_ENV=production
env NODE_ENV=${NODE_ENV}

workdir /usr/src/app

copy package.json ./
copy pnpm-lock.yaml ./

run npm install -g pnpm
run pnpm install --prod

copy --from=development /usr/src/app/dist ./dist

cmd ["node", "dist/apps/auth/main"]