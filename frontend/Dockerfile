FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the optimized production bundle of Next.js
RUN npm run build

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
