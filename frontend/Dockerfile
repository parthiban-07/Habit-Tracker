FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Start the Vite development server (or built build for prod)
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
