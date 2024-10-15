FROM node:18-alpine AS base

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

FROM base AS build
RUN npm run build

EXPOSE 3003
CMD [ "npm", "run", "dev" ]

# FROM nginx:alpine AS production
# COPY --from=build /app/.next /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]