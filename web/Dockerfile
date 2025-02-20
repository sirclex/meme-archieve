FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "run", "start"]