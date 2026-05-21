# Folosim Node 22 pentru faza de dezvoltare
FROM node:22-alpine

WORKDIR /app

# Copiem doar fisierele de dependinte pentru a folosi cache-ul Docker
COPY package*.json ./
RUN npm install

# Copiem restul codului sursa
COPY . .

# Vite foloseste portul 5173 implicit
EXPOSE 5173

# Pornim serverul de dezvoltare si il obligam sa asculte pe toate interfetele
CMD ["npm", "run", "dev", "--", "--host"]