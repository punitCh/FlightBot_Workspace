# 1. Grab a tiny Linux computer with Node.js pre-installed
FROM node:20-alpine

# 2. Create a folder inside that container called /app
WORKDIR /app

# 3. Copy your package files first and install the tools
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4. Copy the rest of your React code into the container
COPY . .

# 5. Tell the container to open the Vite port
EXPOSE 5173

# 6. The final command to start the website! 
# (We add --host so the container allows your browser to view it)
CMD ["npm", "run", "dev", "--", "--host"]